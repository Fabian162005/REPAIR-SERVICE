<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VentaRepuesto;
use App\Services\VentaRepuestoService;
use DomainException;
use Illuminate\Http\Request;

class VentaRepuestoController extends Controller
{
    public function __construct(private VentaRepuestoService $service) {}

    public function index(Request $request)
    {
        $ventas = VentaRepuesto::with(['usuario', 'cliente', 'detalles.producto'])
            ->when($request->tipo_rubro, fn ($q, $r) => $q->where('tipo_rubro', $r))
            ->latest()
            ->limit(50)
            ->get();

        return response()->json(['success' => true, 'data' => $ventas]);
    }

    public function store(Request $request)
    {
        $d = $request->validate([
            'tipo_rubro'    => 'required|in:TECNOLOGIA,VEHICULAR',
            'cliente_id'    => 'nullable|exists:clientes,id',
            'metodo_pago'   => 'required|in:EFECTIVO,YAPE,PLIN,TARJETA,TRANSFERENCIA,OTROS',
            'observaciones' => 'nullable|string|max:500',
            'items'                   => 'required|array|min:1',
            'items.*.producto_id'     => 'required|exists:productos,id',
            'items.*.cantidad'        => 'required|integer|min:1',
            'items.*.precio_unitario' => 'nullable|numeric|min:0',
        ]);

        try {
            $venta = $this->service->crear($request->user()->id, $d);

            return response()->json(['success' => true, 'message' => 'Venta registrada correctamente.', 'data' => $venta], 201);

        } catch (DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function anular(VentaRepuesto $venta)
    {
        try {
            $this->service->anular($venta);

            return response()->json(['success' => true, 'message' => 'Venta anulada y stock devuelto.']);

        } catch (DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }
}