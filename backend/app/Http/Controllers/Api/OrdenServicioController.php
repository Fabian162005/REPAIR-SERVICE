<?php

namespace App\Http\Controllers\Api;

use App\Models\OrdenEstado;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrdenServicioRequest;
use App\Http\Requests\UpdateOrdenServicioRequest;
use App\Models\OrdenServicio;
use Illuminate\Http\Request;
use App\Models\OrdenServicioDetalle;
use App\Models\OrdenRepuesto;
use App\Models\OrdenArchivo;
use App\Models\OrdenPago; 

class OrdenServicioController extends Controller
{
    public function index(Request $request)
    {
        $buscar = $request->buscar;

        $ordenes = OrdenServicio::with([
            'cliente',
            'equipo',
            'vehiculo',
            'usuario',
            'tecnico',
            'archivos',
            'pagos'
        ])

        ->when($buscar, function ($query) use ($buscar) {

            $query->where(
                'codigo_orden',
                'LIKE',
                "%{$buscar}%"
            )

            ->orWhere(
                'falla_reportada',
                'LIKE',
                "%{$buscar}%"
            );
        })

        ->latest()
        ->paginate(10);

        return response()->json(
            $ordenes
        );
    }

public function store(StoreOrdenServicioRequest $request)
{
    $data = $request->validated();

    // =========================
// DATOS VEHICULARES
// =========================

if (($data['tipo_rubro'] ?? null) === 'VEHICULAR') {

    $data['recepcion_vehicular'] =
        $request->recepcion_vehicular;

    $data['diagnostico_vehicular'] =
        $request->diagnostico_vehicular;

    $data['checklist_vehicular'] =
        $request->checklist_vehicular;

    $data['servicios_vehiculares'] =
        $request->servicios_vehiculares;

    $data['proximo_mantenimiento'] =
        $request->proximo_mantenimiento;

}

    // =========================
    // 1. CODIGO
    // =========================
    $ultimoId = OrdenServicio::max('id') + 1;

    $data['codigo_orden'] =
        ($data['tipo_rubro'] === 'VEHICULAR' ? 'MEC-' : 'TEC-')
        . str_pad($ultimoId, 6, '0', STR_PAD_LEFT);

    // =========================
    // 2. ADELANTO INICIAL
    // =========================
    $adelantoInicial = (float) ($data['adelanto'] ?? 0);

    // IMPORTANTE: no guardar duplicado en orden
    $data['adelanto'] = 0;

    // =========================
    // 3. CREAR ORDEN
    // =========================
    $orden = OrdenServicio::create($data);

    // =========================
    // 4. DETALLES
    // =========================
    foreach ($request->detalles ?? [] as $detalle) {
        OrdenServicioDetalle::create([
            'orden_servicio_id' => $orden->id,
            'descripcion' => $detalle['descripcion'],
            'precio' => $detalle['precio']
        ]);
    }

    // =========================
    // 5. REPUESTOS
    // =========================
    foreach ($request->repuestos ?? [] as $repuesto) {
        OrdenRepuesto::create([
            'orden_servicio_id' => $orden->id,
            'nombre' => $repuesto['nombre'],
            'cantidad' => $repuesto['cantidad'],
            'precio_unitario' => $repuesto['precio_unitario'],
            'subtotal' => $repuesto['subtotal']
        ]);
    }

    // =========================
    // 6. ESTADO INICIAL
    // =========================
    OrdenEstado::create([
        'orden_servicio_id' => $orden->id,
        'usuario_id' => auth()->id(),
        'estado' => $orden->estado_actual,
        'observacion' => 'Orden creada',
    ]);

    // =========================
    // 7. CREAR PAGO INICIAL
    // =========================
    if ($adelantoInicial > 0) {
        OrdenPago::create([
            'orden_servicio_id' => $orden->id,
            'usuario_id' => auth()->id(),
            'monto' => $adelantoInicial,
            'metodo_pago' => 'EFECTIVO',
            'observacion' => 'Pago inicial'
        ]);
    }

    // =========================
    // 8. 🔥 RECONSTRUIR DESDE BD (ESTO ES LO CLAVE)
    // =========================
    $totalPagado = OrdenPago::where('orden_servicio_id', $orden->id)
        ->sum('monto');

    $total = (float) $orden->total;
    $saldo = $total - $totalPagado;

    // =========================
    // 9. ACTUALIZAR ORDEN
    // =========================
    $orden->update([
        'adelanto' => $totalPagado,
        'saldo_pendiente' => $saldo,
        'estado_pago' =>
            $saldo <= 0
                ? 'PAGADO'
                : ($totalPagado > 0 ? 'PAGO_PARCIAL' : 'PENDIENTE_PAGO')
    ]);

    return response()->json([
        'message' => 'Orden creada correctamente',
        'orden' => $orden
    ], 201);
}

    public function show(string $id)
    {
        $orden = OrdenServicio::with([

            'cliente',
            'equipo',
            'vehiculo',

            'usuario',
            'tecnico',

            'estados.usuario',

            'detalles',

            'repuestos',

            'archivos',

            'pagos'

        ])->findOrFail($id);

        return response()->json(
            $orden
        );
    }

   public function update(
    UpdateOrdenServicioRequest $request,
    string $id
) {

    $orden =
        OrdenServicio::findOrFail(
            $id
        );

    // GUARDAR EL ESTADO ANTES DE ACTUALIZAR
    $estadoAnterior =
        $orden->estado_actual;

    $data =
        $request->validated();

        if (($data['tipo_rubro'] ?? null) === 'VEHICULAR') {

    $data['recepcion_vehicular'] =
        $request->recepcion_vehicular;

    $data['diagnostico_vehicular'] =
        $request->diagnostico_vehicular;

    $data['checklist_vehicular'] =
        $request->checklist_vehicular;

    $data['servicios_vehiculares'] =
        $request->servicios_vehiculares;

    $data['proximo_mantenimiento'] =
        $request->proximo_mantenimiento;

}

      
    $data['saldo_pendiente'] =
        ($data['total'] ?? $orden->total)
        -
        ($data['adelanto'] ?? $orden->adelanto);


    // ACTUALIZAR SOLO UNA VEZ
    $orden->update($data);

$orden->detalles()->delete();

if (!empty($request->detalles)) {

    foreach ($request->detalles as $detalle) {

        OrdenServicioDetalle::create([

            'orden_servicio_id' => $orden->id,

            'descripcion' => $detalle['descripcion'],

            'precio' => $detalle['precio']

        ]);
    }
}

$orden->repuestos()->delete();

if (!empty($request->repuestos)) {

    foreach ($request->repuestos as $repuesto) {

        OrdenRepuesto::create([

            'orden_servicio_id' => $orden->id,

            'nombre' => $repuesto['nombre'],

            'cantidad' => $repuesto['cantidad'],

            'precio_unitario' =>
                $repuesto['precio_unitario'],

            'subtotal' =>
                $repuesto['subtotal']

        ]);
    }
}

    // SI CAMBIÓ EL ESTADO, GUARDAR HISTORIAL
    if (
        isset($data['estado_actual'])
        &&
        $estadoAnterior !== $data['estado_actual']
    ) {

        OrdenEstado::create([

            'orden_servicio_id' =>
                $orden->id,

            'usuario_id' =>
                auth()->id(),

            'estado' =>
                $data['estado_actual'],

            'observacion' =>
                'Cambio de estado',
        ]);
    }

    return response()->json([
        'message' =>
            'Orden actualizada correctamente',

        'orden' => $orden
    ]);
}

    public function destroy(string $id)
    {
        $orden =
            OrdenServicio::findOrFail(
                $id
            );

        $orden->delete();

        return response()->json([
            'message' =>
                'Orden eliminada correctamente'
        ]);
    }
}