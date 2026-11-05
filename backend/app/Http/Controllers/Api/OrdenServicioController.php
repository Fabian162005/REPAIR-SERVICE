<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrdenServicioRequest;
use App\Http\Requests\UpdateOrdenServicioRequest;
use App\Models\OrdenEstado;
use App\Models\OrdenPago;
use App\Models\OrdenServicio;
use App\Models\OrdenServicioDetalle;
use App\Services\CajaService;
use App\Services\OrdenRepuestoService;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Auditoria;
use App\Services\PermisoService;
class OrdenServicioController extends Controller
{
    public function __construct(
    private OrdenRepuestoService $repuestoService,
    private CajaService $cajaService,
    private PermisoService $permiso
) {}
private function exigirPagoParaEntrega(?string $estado, float $total, float $pagado): void
{
    $saldo = $total - $pagado;

    if ($estado === 'ENTREGADO' && $saldo > 0.009) {
        throw new DomainException(
            sprintf('No se puede entregar: la orden tiene un saldo pendiente de S/ %.2f.', $saldo)
        );
    }
}
public function cambiarEstado(Request $request, string $id)
{
    $d = $request->validate([
        'estado_actual' => 'required|in:RECEPCIONADO,DIAGNOSTICO,ESPERANDO_APROBACION,EN_REPARACION,REPARADO,ENTREGADO',
        'observacion'   => 'nullable|string|max:255',
    ]);

    $orden = OrdenServicio::findOrFail($id);

    if ($orden->estado_actual === $d['estado_actual']) {
        return response()->json(['message' => 'La orden ya tiene ese estado.'], 422);
    }

    $esAdmin = $request->user()->rol === 'ADMIN';

    if (!$esAdmin && in_array($orden->estado_actual, ['ENTREGADO', 'CANCELADO'])) {
        return response()->json([
            'message' => 'Esta orden está cerrada. Solo el administrador puede cambiar su estado.'
        ], 403);
    }

    try {
        $pagado = (float) OrdenPago::where('orden_servicio_id', $orden->id)->sum('monto');

        $this->exigirPagoParaEntrega($d['estado_actual'], (float) $orden->total, $pagado);

        DB::transaction(function () use ($orden, $d) {

            $orden->estado_actual = $d['estado_actual'];

            if ($d['estado_actual'] === 'ENTREGADO' && !$orden->fecha_entrega_real) {
                $orden->fecha_entrega_real = now();
            }

            $orden->save();

            OrdenEstado::create([
                'orden_servicio_id' => $orden->id,
                'usuario_id'        => auth()->id(),
                'estado'            => $d['estado_actual'],
                'observacion'       => $d['observacion'] ?? 'Cambio de estado',
            ]);
        });

    } catch (DomainException $e) {
        return response()->json(['message' => $e->getMessage()], 422);
    }

    return response()->json([
        'message' => 'Estado actualizado correctamente',
        'orden'   => $orden->fresh(),
    ]);
}

    public function index(Request $request)
    {
        $buscar = $request->buscar;

        $ordenes = OrdenServicio::with([
            'cliente', 'equipo', 'vehiculo', 'usuario', 'tecnico', 'archivos', 'pagos'
        ])
            ->when($buscar, function ($query) use ($buscar) {
                $query->where(function ($q) use ($buscar) {
                    $q->where('codigo_orden', 'LIKE', "%{$buscar}%")
                      ->orWhere('falla_reportada', 'LIKE', "%{$buscar}%");
                });
            })
            ->latest()
            ->paginate(10);

        return response()->json($ordenes);
    }

    public function store(StoreOrdenServicioRequest $request)
    {
        try {
            $orden = DB::transaction(function () use ($request) {

                $data = $request->validated();

                // DATOS VEHICULARES
                if (($data['tipo_rubro'] ?? null) === 'VEHICULAR') {
                    $data['recepcion_vehicular']   = $request->recepcion_vehicular;
                    $data['diagnostico_vehicular'] = $request->diagnostico_vehicular;
                    $data['checklist_vehicular']   = $request->checklist_vehicular;
                    $data['servicios_vehiculares'] = $request->servicios_vehiculares;
                    $data['proximo_mantenimiento'] = $request->proximo_mantenimiento;
                }

                // 1. CÓDIGO
                $ultimoId = OrdenServicio::max('id') + 1;

                $data['codigo_orden'] =
                    ($data['tipo_rubro'] === 'VEHICULAR' ? 'MEC-' : 'TEC-')
                    . str_pad($ultimoId, 6, '0', STR_PAD_LEFT);

                // 2. ADELANTO INICIAL (se guarda como pago, no duplicado en la orden)
                $adelantoInicial = (float) ($data['adelanto'] ?? 0);
                $metodoAdelanto  = $data['metodo_pago_adelanto'] ?? 'EFECTIVO';

                unset($data['metodo_pago_adelanto']);
                $data['adelanto'] = 0;

                // 3. CREAR ORDEN
                $orden = OrdenServicio::create($data);

                // 4. DETALLES
                foreach ($request->detalles ?? [] as $detalle) {
                    OrdenServicioDetalle::create([
                        'orden_servicio_id' => $orden->id,
                        'descripcion'       => $detalle['descripcion'],
                        'precio'            => $detalle['precio'],
                    ]);
                }

                // 5. REPUESTOS (descuenta stock y registra kardex)
                $this->repuestoService->sincronizar($orden, $request->repuestos ?? []);

                // 6. ESTADO INICIAL
                OrdenEstado::create([
                    'orden_servicio_id' => $orden->id,
                    'usuario_id'        => auth()->id(),
                    'estado'            => $orden->estado_actual,
                    'observacion'       => 'Orden creada',
                ]);

                // 7. PAGO INICIAL (entra a caja)
                if ($adelantoInicial > 0) {
                    $pago = OrdenPago::create([
                        'orden_servicio_id' => $orden->id,
                        'usuario_id'        => auth()->id(),
                        'monto'             => $adelantoInicial,
                        'metodo_pago'       => $metodoAdelanto,
                        'observacion'       => 'Pago inicial',
                    ]);

                    $this->cajaService->ingresoPorPago($pago, $orden);
                }

                // 8. RECONSTRUIR DESDE BD
                $totalPagado = OrdenPago::where('orden_servicio_id', $orden->id)->sum('monto');
                $saldo = (float) $orden->total - $totalPagado;

                $this->exigirPagoParaEntrega($data['estado_actual'] ?? null, (float) $orden->total, (float) $totalPagado);

                // 9. ACTUALIZAR ORDEN
                $orden->update([
                    'adelanto'        => $totalPagado,
                    'saldo_pendiente' => $saldo,
                    'estado_pago'     => $saldo <= 0
                        ? 'PAGADO'
                        : ($totalPagado > 0 ? 'PAGO_PARCIAL' : 'PENDIENTE_PAGO'),
                ]);

                return $orden;
            });

        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Orden creada correctamente',
            'orden'   => $orden,
        ], 201);
    }

    public function show(string $id)
    {
        $orden = OrdenServicio::with([
            'cliente', 'equipo', 'vehiculo', 'usuario', 'tecnico',
            'estados.usuario', 'detalles', 'repuestos.producto', 'archivos', 'pagos'
        ])->findOrFail($id);

        return response()->json($orden);
    }

    public function update(UpdateOrdenServicioRequest $request, string $id)
    {
        $orden = OrdenServicio::findOrFail($id);

        if ($request->user()->rol !== 'ADMIN') {
            try {
                $this->permiso->verificar($request->clave_permiso);
            } catch (DomainException $e) {
                return response()->json([
                    'message'        => $e->getMessage(),
                    'requiere_clave' => $e->getCode() === PermisoService::REQUIERE_CLAVE,
                ], 422);
            }
        }

        try {
            DB::transaction(function () use ($request, $orden) {

                $estadoAnterior = $orden->estado_actual;

                $data = $request->validated();

                if (($data['tipo_rubro'] ?? null) === 'VEHICULAR') {
                    $data['recepcion_vehicular']   = $request->recepcion_vehicular;
                    $data['diagnostico_vehicular'] = $request->diagnostico_vehicular;
                    $data['checklist_vehicular']   = $request->checklist_vehicular;
                    $data['servicios_vehiculares'] = $request->servicios_vehiculares;
                    $data['proximo_mantenimiento'] = $request->proximo_mantenimiento;
                }

                // El adelanto real lo manejan los pagos, no el formulario
                unset($data['adelanto'], $data['metodo_pago_adelanto']);

                $total = (float) ($data['total'] ?? $orden->total);
                $pagado = (float) OrdenPago::where('orden_servicio_id', $orden->id)->sum('monto');

                $this->exigirPagoParaEntrega($data['estado_actual'] ?? $orden->estado_actual, $total, $pagado);

                $data['adelanto']        = $pagado;
                $data['saldo_pendiente'] = max($total - $pagado, 0);
                $data['estado_pago']     = ($total - $pagado) <= 0
                    ? 'PAGADO'
                    : ($pagado > 0 ? 'PAGO_PARCIAL' : 'PENDIENTE_PAGO');

                $orden->update($data);

                // DETALLES
                $orden->detalles()->delete();

                foreach ($request->detalles ?? [] as $detalle) {
                    OrdenServicioDetalle::create([
                        'orden_servicio_id' => $orden->id,
                        'descripcion'       => $detalle['descripcion'],
                        'precio'            => $detalle['precio'],
                    ]);
                }

                // REPUESTOS (solo mueve la diferencia de stock)
                $this->repuestoService->sincronizar($orden, $request->repuestos ?? []);

                // HISTORIAL DE ESTADO
                if (
                    isset($data['estado_actual'])
                    && $estadoAnterior !== $data['estado_actual']
                ) {
                    OrdenEstado::create([
                        'orden_servicio_id' => $orden->id,
                        'usuario_id'        => auth()->id(),
                        'estado'            => $data['estado_actual'],
                        'observacion'       => 'Cambio de estado',
                    ]);
                }
            });

        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

                if ($request->user()->rol !== 'ADMIN') {
            Auditoria::registrar('EDITAR_ORDEN', 'orden', $orden->id, ['codigo' => $orden->codigo_orden]);
        }

        return response()->json([
            'message' => 'Orden actualizada correctamente',
            'orden'   => $orden->fresh(),
        ]);
    }

  public function destroy(Request $request, string $id)
{
    $orden = OrdenServicio::findOrFail($id);

    try {
        $forzar = false;

        if ($request->filled('clave_permiso')) {
            $this->permiso->verificar($request->clave_permiso);
            $forzar = true;
        }

        DB::transaction(function () use ($orden, $forzar) {
            $this->cajaService->anularPorOrden($orden, $forzar);
            $this->repuestoService->revertir($orden);

            if ($forzar) {
                Auditoria::registrar('ELIMINAR_ORDEN', 'orden', $orden->id, ['codigo' => $orden->codigo_orden]);
            }

            $orden->delete();
        });

    } catch (DomainException $e) {
        return response()->json([
            'message'        => $e->getMessage(),
            'requiere_clave' => $e->getCode() === PermisoService::REQUIERE_CLAVE,
        ], 422);
    }

    return response()->json(['message' => 'Orden eliminada correctamente']);
}


    
}