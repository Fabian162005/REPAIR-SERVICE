<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrdenPago;
use App\Models\OrdenServicio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdenPagoController extends Controller
{
    public function index($ordenId)
    {
        $pagos = OrdenPago::with(
            'usuario'
        )
        ->where(
            'orden_servicio_id',
            $ordenId
        )
        ->latest()
        ->get();

        return response()->json([
            'success' => true,
            'data' => $pagos
        ]);
    }
public function store(Request $request)
{
    $request->validate([
        'orden_servicio_id' => 'required|exists:orden_servicios,id',
        'monto' => 'required|numeric|min:0.01',
        'metodo_pago' => 'required|in:EFECTIVO,YAPE,PLIN,TRANSFERENCIA,TARJETA',
        'observacion' => 'nullable|string'
    ]);

    return DB::transaction(function () use ($request) {

        $orden = OrdenServicio::findOrFail($request->orden_servicio_id);

        if ($orden->estado_pago === 'PAGADO') {
            return response()->json([
                'success' => false,
                'message' => 'La orden ya está completamente pagada'
            ], 422);
        }

        // 1. CREAR PAGO
        OrdenPago::create([
            'orden_servicio_id' => $orden->id,
            'usuario_id' => auth()->id(),
            'monto' => $request->monto,
            'metodo_pago' => $request->metodo_pago,
            'observacion' => $request->observacion
        ]);

        // 2. RECIÉN AQUÍ CALCULAR TODO
        $totalPagado = OrdenPago::where('orden_servicio_id', $orden->id)->sum('monto');

        $saldo = (float) $orden->total - (float) $totalPagado;

        // 3. DEBUG (IMPORTANTE)
        \Log::info("TOTAL PAGADO: ".$totalPagado);
        \Log::info("SALDO: ".$saldo);

        // 4. UPDATE FORZADO
        $orden->adelanto = $totalPagado;
        $orden->saldo_pendiente = max($saldo, 0);

        $orden->estado_pago =
            $saldo <= 0
                ? 'PAGADO'
                : ($totalPagado > 0 ? 'PAGO_PARCIAL' : 'PENDIENTE_PAGO');

        $orden->save();

        return response()->json([
            'success' => true,
            'message' => 'Pago registrado correctamente',
            'debug' => [
                'total_pagado' => $totalPagado,
                'saldo' => $saldo,
                'estado_pago' => $orden->estado_pago
            ]
        ]);
    });
}   

    public function destroy($id)
    {
        $pago = OrdenPago::findOrFail($id);

        $pago->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pago eliminado'
        ]);
    }
}