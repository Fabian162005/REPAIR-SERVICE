<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrdenServicioRequest;
use App\Http\Requests\UpdateOrdenServicioRequest;
use App\Models\OrdenEstado;
use App\Models\OrdenPago;
use App\Models\OrdenServicio;
use App\Models\OrdenServicioDetalle;
use App\Services\OrdenRepuestoService;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdenServicioController extends Controller
{
    public function __construct(private OrdenRepuestoService $repuestoService) {}

    public function index(Request $request)
    {
        $buscar = $request->buscar;

        $ordenes = OrdenServicio::with([
            'cliente', 'equipo', 'vehiculo', 'usuario', 'tecnico', 'archivos', 'pagos'
        ])
            ->when($buscar, function ($query) use ($buscar) {
                $query->where('codigo_orden', 'LIKE', "%{$buscar}%")
                      ->orWhere('falla_reportada', 'LIKE', "%{$buscar}%");
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

                // 2. ADELANTO INICIAL (no se guarda duplicado en la orden)
                $adelantoInicial = (float) ($data['adelanto'] ?? 0);
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

                // 7. PAGO INICIAL
                if ($adelantoInicial > 0) {
                    OrdenPago::create([
                        'orden_servicio_id' => $orden->id,
                        'usuario_id'        => auth()->id(),
                        'monto'             => $adelantoInicial,
                        'metodo_pago'       => 'EFECTIVO',
                        'observacion'       => 'Pago inicial',
                    ]);
                }

                // 8. RECONSTRUIR DESDE BD
                $totalPagado = OrdenPago::where('orden_servicio_id', $orden->id)->sum('monto');
                $saldo = (float) $orden->total - $totalPagado;

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

                $data['saldo_pendiente'] =
                    ($data['total'] ?? $orden->total)
                    - ($data['adelanto'] ?? $orden->adelanto);

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

        return response()->json([
            'message' => 'Orden actualizada correctamente',
            'orden'   => $orden->fresh(),
        ]);
    }

    public function destroy(string $id)
    {
        $orden = OrdenServicio::findOrFail($id);

        DB::transaction(function () use ($orden) {
            $this->repuestoService->revertir($orden); // devuelve el stock
            $orden->delete();
        });

        return response()->json(['message' => 'Orden eliminada correctamente']);
    }
}