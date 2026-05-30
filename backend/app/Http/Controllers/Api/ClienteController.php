<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClienteRequest;
use App\Http\Requests\UpdateClienteRequest;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * LISTAR CLIENTES
     */
    public function index(Request $request)
    {
        $buscar = $request->buscar;

        $clientes = Cliente::query()

            ->when($buscar, function ($query) use ($buscar) {

                $query->where('nombres', 'LIKE', "%{$buscar}%")
                    ->orWhere('apellidos', 'LIKE', "%{$buscar}%")
                    ->orWhere('numero_documento', 'LIKE', "%{$buscar}%")
                    ->orWhere('celular', 'LIKE', "%{$buscar}%");
            })

            ->latest()
            ->paginate(10);

        return response()->json($clientes);
    }

    /**
     * CREAR CLIENTE
     */
    public function store(StoreClienteRequest $request)
    {
        $cliente = Cliente::create($request->validated());

        return response()->json([
            'message' => 'Cliente creado correctamente',
            'cliente' => $cliente
        ], 201);
    }

    /**
     * MOSTRAR CLIENTE
     */
    public function show(string $id)
    {
        $cliente = Cliente::findOrFail($id);

        return response()->json($cliente);
    }

    /**
     * ACTUALIZAR CLIENTE
     */
    public function update(UpdateClienteRequest $request, string $id)
    {
        $cliente = Cliente::findOrFail($id);

        $cliente->update($request->validated());

        return response()->json([
            'message' => 'Cliente actualizado correctamente',
            'cliente' => $cliente
        ]);
    }

    /**
     * ELIMINAR CLIENTE
     */
    public function destroy(string $id)
    {
        $cliente = Cliente::findOrFail($id);

        $cliente->delete();

        return response()->json([
            'message' => 'Cliente eliminado correctamente'
        ]);
    }
}