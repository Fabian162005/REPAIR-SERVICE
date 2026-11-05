<?php

namespace App\Services;

use App\Models\Caja;
use App\Models\MovimientoCaja;
use App\Models\OrdenPago;
use App\Models\OrdenServicio;
use DomainException;
use Illuminate\Support\Facades\DB;

class CajaService
{
    public function abrir(?int $userId, float $monto, ?string $obs = null): Caja
    {
        if (!$userId) {
            throw new DomainException('Debes iniciar sesión.');
        }

        return DB::transaction(function () use ($userId, $monto, $obs) {

            $pendiente = Caja::where('usuario_id', $userId)
                ->abiertas()
                ->whereDate('fecha', '<', today())
                ->first();

            if ($pendiente) {
                throw new DomainException(
                    "Hay una caja del {$pendiente->fecha->format('d/m/Y')} sin cerrar. Debe cerrarse antes de abrir la de hoy."
                );
            }

            if (Caja::where('usuario_id', $userId)->whereDate('fecha', today())->exists()) {
                throw new DomainException('La caja de hoy ya fue abierta.');
            }

            return Caja::create([
                'usuario_id'     => $userId,
                'fecha'          => today()->toDateString(),
                'monto_apertura' => $monto,
                'estado'         => 'ABIERTA',
                'abierta_at'     => now(),
                'observaciones'  => $obs,
            ]);
        });
    }

    /** Caja ABIERTA de hoy del usuario, o excepción con mensaje claro. */
    public function requerirAbierta(?int $userId): Caja
    {
        if (!$userId) {
            throw new DomainException('Debes iniciar sesión para registrar cobros.');
        }

        $caja = Caja::where('usuario_id', $userId)->abiertas()->latest('fecha')->first();

        if (!$caja) {
            throw new DomainException('Tu caja no está abierta. Pide al administrador que la abra.');
        }

        if ($caja->fecha->lt(today())) {
            throw new DomainException(
                "La caja del {$caja->fecha->format('d/m/Y')} sigue sin cerrar. Debe cerrarse y abrirse la de hoy."
            );
        }

        return $caja;
    }

    public function registrar(
        Caja $caja,
        string $tipo,
        string $origen,
        float $monto,
        string $metodo,
        string $descripcion,
        array $extra = []
    ): MovimientoCaja {

        if ($caja->estado !== 'ABIERTA') {
            throw new DomainException('La caja está cerrada.');
        }

        return MovimientoCaja::create(array_merge([
            'caja_id'          => $caja->id,
            'usuario_id'       => $caja->usuario_id,
            'tipo_movimiento'  => $tipo,
            'origen'           => $origen,
            'monto'            => $monto,
            'metodo_pago'      => $metodo,
            'descripcion'      => $descripcion,
            'fecha_movimiento' => now(),
        ], $extra));
    }

    public function ingresoPorPago(OrdenPago $pago, OrdenServicio $orden): MovimientoCaja
    {
        $caja = $this->requerirAbierta($pago->usuario_id);

        return $this->registrar(
            $caja, 'INGRESO', 'PAGO_ORDEN',
            (float) $pago->monto, $pago->metodo_pago,
            "Pago de orden {$orden->codigo_orden}",
            [
                'orden_servicio_id' => $orden->id,
                'orden_pago_id'     => $pago->id,
                'tipo_rubro'        => $orden->tipo_rubro,
            ]
        );
    }

    public function egreso(?int $userId, float $monto, string $metodo, string $descripcion, ?string $obs = null, ?string $rubro = null): MovimientoCaja
{
    $caja = $this->requerirAbierta($userId);

    return $this->registrar(
        $caja, 'EGRESO', 'GASTO_MANUAL', $monto, $metodo, $descripcion,
        ['observacion' => $obs, 'tipo_rubro' => $rubro]
    );
}

    /** Se anula, no se borra. Una caja cerrada no se toca. */
  public function anularMovimiento(MovimientoCaja $mov, bool $forzar = false): void
        {
            if ($mov->anulado) {
                return;
            }

            $cerrada = $mov->caja && $mov->caja->estado === 'CERRADA';

            if ($cerrada && !$forzar) {
                throw new DomainException(
                    'El movimiento pertenece a una caja ya cerrada. Se requiere la clave de permiso.',
                    PermisoService::REQUIERE_CLAVE
                );
            }

            $mov->update(['anulado' => true]);

            if ($cerrada) {
                $this->recalcularCerrada($mov->caja);
            }
        }

        public function anularPorPago(OrdenPago $pago, bool $forzar = false): void
        {
            MovimientoCaja::with('caja')
                ->where('orden_pago_id', $pago->id)
                ->where('anulado', false)
                ->get()
                ->each(fn ($m) => $this->anularMovimiento($m, $forzar));
        }

        public function anularPorOrden(OrdenServicio $orden, bool $forzar = false): void
        {
            MovimientoCaja::with('caja')
                ->where('orden_servicio_id', $orden->id)
                ->where('anulado', false)
                ->get()
                ->each(fn ($m) => $this->anularMovimiento($m, $forzar));
        }

        /** Tras anular algo en una caja cerrada: recalcula esperado y diferencia (el contado no se toca). */
        private function recalcularCerrada(Caja $caja): void
        {
            $caja = $caja->fresh();
            $esperado = $this->resumen($caja)['efectivo_esperado'];

            $caja->update([
                'efectivo_esperado' => $esperado,
                'diferencia'        => round((float) $caja->efectivo_contado - $esperado, 2),
            ]);
        }

        public function reabrir(Caja $caja): Caja
        {
            return DB::transaction(function () use ($caja) {

                $caja = Caja::lockForUpdate()->findOrFail($caja->id);

                if ($caja->estado === 'ABIERTA') {
                    throw new DomainException('La caja ya está abierta.');
                }

                $otra = Caja::where('usuario_id', $caja->usuario_id)
                    ->abiertas()->where('id', '!=', $caja->id)->exists();

                if ($otra) {
                    throw new DomainException('Ese usuario tiene otra caja abierta. Ciérrala primero.');
                }

                $caja->update(['estado' => 'ABIERTA', 'cerrada_at' => null]);

                return $caja->fresh('usuario');
            });
        }

        public function ajustarContado(Caja $caja, float $nuevo): Caja
        {
            if ($caja->estado !== 'CERRADA') {
                throw new DomainException('Solo se ajusta el conteo de una caja cerrada.');
            }

            $caja->update([
                'efectivo_contado' => $nuevo,
                'diferencia'       => round($nuevo - (float) $caja->efectivo_esperado, 2),
            ]);

            return $caja->fresh('usuario');
        }

    public function resumen(Caja $caja): array
    {
        $movs = $caja->movimientos()->vigentes()->get();

        $ing = $movs->where('tipo_movimiento', 'INGRESO');
        $egr = $movs->where('tipo_movimiento', 'EGRESO');

        $porMetodo = $movs->groupBy('metodo_pago')->map(fn ($g) => [
            'ingresos' => round((float) $g->where('tipo_movimiento', 'INGRESO')->sum('monto'), 2),
            'egresos'  => round((float) $g->where('tipo_movimiento', 'EGRESO')->sum('monto'), 2),
        ]);

        $ingEf = (float) $ing->where('metodo_pago', 'EFECTIVO')->sum('monto');
        $egrEf = (float) $egr->where('metodo_pago', 'EFECTIVO')->sum('monto');
        
        $porRubro = $movs->groupBy(fn ($m) => $m->tipo_rubro ?? 'GENERAL')->map(fn ($g) => [
            'ingresos' => round((float) $g->where('tipo_movimiento', 'INGRESO')->sum('monto'), 2),
            'egresos'  => round((float) $g->where('tipo_movimiento', 'EGRESO')->sum('monto'), 2),
        ]);

        return [
            'monto_apertura'    => (float) $caja->monto_apertura,
            'total_ingresos'    => round((float) $ing->sum('monto'), 2),
            'total_egresos'     => round((float) $egr->sum('monto'), 2),
            'saldo'             => round((float) $caja->monto_apertura + $ing->sum('monto') - $egr->sum('monto'), 2),
            'efectivo_esperado' => round((float) $caja->monto_apertura + $ingEf - $egrEf, 2),
            'por_metodo'        => $porMetodo,
            'por_rubro' => $porRubro,
        ];
    }

    public function cerrar(Caja $caja, float $efectivoContado, ?string $obs = null): Caja
    {
        return DB::transaction(function () use ($caja, $efectivoContado, $obs) {

            $caja = Caja::lockForUpdate()->findOrFail($caja->id);

            if ($caja->estado === 'CERRADA') {
                throw new DomainException('La caja ya está cerrada.');
            }

            $esperado = $this->resumen($caja)['efectivo_esperado'];

            $caja->update([
                'efectivo_esperado' => $esperado,
                'efectivo_contado'  => $efectivoContado,
                'diferencia'        => round($efectivoContado - $esperado, 2),
                'estado'            => 'CERRADA',
                'cerrada_at'        => now(),
                'observaciones'     => $obs ?? $caja->observaciones,
            ]);

            return $caja->fresh('usuario');
        });
    }

    public function cajaGeneral(string $fecha): array
    {
        $cajas = Caja::with('usuario')->whereDate('fecha', $fecha)->get();

        $porUsuario = $cajas->map(function ($c) {
            $r = $this->resumen($c);

            return [
                'caja_id'    => $c->id,
                'usuario'    => $c->usuario->name ?? '-',
                'estado'     => $c->estado,
                'apertura'   => $r['monto_apertura'],
                'ingresos'   => $r['total_ingresos'],
                'egresos'    => $r['total_egresos'],
                'saldo'      => $r['saldo'],
                'diferencia' => $c->diferencia,
            ];
        })->values();

        $porMetodo = MovimientoCaja::vigentes()
            ->whereIn('caja_id', $cajas->pluck('id'))
            ->get()
            ->groupBy('metodo_pago')
            ->map(fn ($g) => [
                'ingresos' => round((float) $g->where('tipo_movimiento', 'INGRESO')->sum('monto'), 2),
                'egresos'  => round((float) $g->where('tipo_movimiento', 'EGRESO')->sum('monto'), 2),
            ]);

        return [
            'fecha'          => $fecha,
            'total_ingresos' => $porUsuario->sum('ingresos'),
            'total_egresos'  => $porUsuario->sum('egresos'),
            'saldo'          => $porUsuario->sum('saldo'),
            'por_usuario'    => $porUsuario,
            'por_metodo'     => $porMetodo,
        ];
    }
}