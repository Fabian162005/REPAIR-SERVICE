<?php

namespace App\Services;

use App\Models\InventarioMovimiento;
use App\Models\Producto;
use App\Models\VentaRepuesto;
use App\Models\VentaRepuestoDetalle;
use DomainException;
use Illuminate\Support\Facades\DB;

class VentaRepuestoService
{
    public function __construct(
        private MovimientoService $movimientos,
        private CajaService $caja
    ) {}

    public function crear(int $userId, array $data): VentaRepuesto
    {
        return DB::transaction(function () use ($userId, $data) {

            $caja = $this->caja->requerirAbierta($userId);

            $venta = VentaRepuesto::create([
                'codigo'        => 'TMP-' . uniqid(),
                'usuario_id'    => $userId,
                'cliente_id'    => $data['cliente_id'] ?? null,
                'tipo_rubro'    => $data['tipo_rubro'],
                'metodo_pago'   => $data['metodo_pago'],
                'observaciones' => $data['observaciones'] ?? null,
                'total'         => 0,
            ]);

            $venta->update(['codigo' => 'VTA-' . str_pad($venta->id, 6, '0', STR_PAD_LEFT)]);

            $total = 0;

            foreach ($data['items'] as $item) {

                $producto = Producto::with('categoria')->findOrFail($item['producto_id']);

                if ($producto->categoria?->tipo_rubro !== $data['tipo_rubro']) {
                    throw new DomainException("\"{$producto->nombre}\" no pertenece al rubro {$data['tipo_rubro']}.");
                }

                $precio   = (float) ($item['precio_unitario'] ?? $producto->precio_venta);
                $subtotal = round($item['cantidad'] * $precio, 2);
                $total   += $subtotal;

                VentaRepuestoDetalle::create([
                    'venta_repuesto_id' => $venta->id,
                    'producto_id'       => $producto->id,
                    'cantidad'          => $item['cantidad'],
                    'precio_unitario'   => $precio,
                    'subtotal'          => $subtotal,
                ]);

                $this->movimientos->registrar(
                    $producto->id, InventarioMovimiento::SALIDA, $item['cantidad'],
                    'VENTA', 'VENTA_REPUESTO', $venta->id, $venta->codigo
                );
            }

            $venta->update(['total' => $total]);

            $this->caja->registrar(
                $caja, 'INGRESO', 'VENTA_REPUESTO', $total, $data['metodo_pago'],
                "Venta de repuestos {$venta->codigo}",
                ['venta_repuesto_id' => $venta->id, 'tipo_rubro' => $data['tipo_rubro']]
            );

            return $venta->load('detalles.producto');
        });
    }

    public function anular(VentaRepuesto $venta): void
    {
        DB::transaction(function () use ($venta) {

            if ($venta->estado === 'ANULADA') {
                throw new DomainException('La venta ya está anulada.');
            }

            // Falla si la caja ya está cerrada
            $venta->movimientosCaja()->with('caja')->get()
                ->each(fn ($m) => $this->caja->anularMovimiento($m));

            foreach ($venta->detalles as $d) {
                $this->movimientos->registrar(
                    $d->producto_id, InventarioMovimiento::ENTRADA, $d->cantidad,
                    'DEVOLUCION', 'VENTA_REPUESTO', $venta->id, "Anulación {$venta->codigo}"
                );
            }

            $venta->update(['estado' => 'ANULADA']);
        });
    }
}