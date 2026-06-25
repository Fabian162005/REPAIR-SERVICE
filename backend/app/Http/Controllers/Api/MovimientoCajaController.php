<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MovimientoCaja;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateMovimientoCajaRequest;

class MovimientoCajaController extends Controller
{
    /**
     * Listar movimientos
     */
    public function index()
    {
        $movimientos = MovimientoCaja::with([
            'usuario',
            'ordenServicio'
        ])
        ->latest()
        ->get();

        return response()->json([
            'message' => 'Lista de movimientos',
            'data' => $movimientos
        ]);
    }

    /**
     * Registrar movimiento
     */
    public function store(Request $request)
    {
        $request->validate([
            'tipo_movimiento' => 'required|in:INGRESO,EGRESO',
            'origen' => 'required|in:PAGO_ORDEN,GASTO_MANUAL,AJUSTE',
            'usuario_id' => 'required|integer',
            'monto' => 'required|numeric|min:0.01',
            'descripcion' => 'required|string|max:255',
            'fecha_movimiento' => 'required|date',
        ]);

        $movimiento = MovimientoCaja::create([

            'tipo_movimiento' => $request->tipo_movimiento,

            'origen' => $request->origen,

            'tipo_rubro' => $request->tipo_rubro,

            'orden_servicio_id' => $request->orden_servicio_id,

            'usuario_id' => $request->usuario_id,

            'monto' => $request->monto,

            'descripcion' => $request->descripcion,

            'observacion' => $request->observacion,

            'fecha_movimiento' => $request->fecha_movimiento
        ]);

        return response()->json([
            'message' => 'Movimiento registrado correctamente',
            'data' => $movimiento
        ], 201);
    }

    /**
     * Mostrar movimiento
     */
    public function show(string $id)
    {
        $movimiento = MovimientoCaja::with([
            'usuario',
            'ordenServicio'
        ])->findOrFail($id);

        return response()->json([
            'data' => $movimiento
        ]);
    }

    /**
     * Actualizar movimiento
     */
public function update(UpdateMovimientoCajaRequest $request, $id)
{
    $mov = MovimientoCaja::findOrFail($id);

    $mov->update($request->validated());

    return response()->json([
        'message' => 'Actualizado correctamente',
        'data' => $mov->fresh(['usuario', 'ordenServicio'])
    ]);
}

    /**
     * Eliminar movimiento
     */
    public function destroy(string $id)
    {
        $movimiento = MovimientoCaja::findOrFail($id);

        $movimiento->delete();

        return response()->json([
            'message' => 'Movimiento eliminado correctamente'
        ]);
    }
}