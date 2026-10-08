<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInventarioMovimientoRequest;
use App\Http\Resources\InventarioMovimientoResource;
use App\Models\Producto;
use App\Services\MovimientoService;
use DomainException;

class MovimientoController extends Controller
{
    public function index(Producto $producto)
    {
        $movs = $producto->movimientos()
            ->with('usuario')
            ->latest()
            ->limit(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => InventarioMovimientoResource::collection($movs),
        ]);
    }

    public function store(
        StoreInventarioMovimientoRequest $request,
        Producto $producto,
        MovimientoService $service
    ) {
        $d = $request->validated();

        try {
            $mov = $service->registrar(
                $producto->id,
                $d['tipo_movimiento'],
                $d['cantidad'],
                $d['motivo'],
                'MANUAL',
                null,
                $d['observaciones'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Movimiento registrado correctamente.',
                'data' => new InventarioMovimientoResource($mov->load('usuario')),
            ], 201);

        } catch (DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }
}