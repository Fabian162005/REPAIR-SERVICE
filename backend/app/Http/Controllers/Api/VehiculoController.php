<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    public function index()
    {
        return Vehiculo::with('cliente')
            ->where('activo', true)
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([

            'cliente_id' =>
                'required|exists:clientes,id',

            'tipo_vehiculo' =>
                'required|in:CARRO,MOTO_LINEAL,MOTOTAXI',

            'placa' =>
                'required|unique:vehiculos,placa',

            'marca' =>
                'required|string|max:255',

            'modelo' =>
                'required|string|max:255',

            'anio' =>
                'nullable|integer',

            'numero_motor' =>
                'nullable|string|max:255',

            'numero_chasis' =>
                'nullable|string|max:255',

            'combustible' =>
                'nullable|in:GASOLINA,DIESEL,GLP,GNV,HIBRIDO,ELECTRICO',

            'cilindrada' =>
                'nullable|string|max:255',

            'color' =>
                'nullable|string|max:255',

            'kilometraje' =>
                'nullable|integer',

            'observaciones' =>
                'nullable|string'
        ]);

        $vehiculo = Vehiculo::create(
            $validated
        );

        return response()->json([
            'message' => 'Vehículo registrado correctamente',
            'data' => $vehiculo
        ], 201);
    }

    public function show(string $id)
    {
        return Vehiculo::with([
            'cliente',
            'ordenes'
        ])->findOrFail($id);
    }

    public function update(
        Request $request,
        Vehiculo $vehiculo
    ) {

        $validated = $request->validate([

            'cliente_id' =>
                'required|exists:clientes,id',

            'tipo_vehiculo' =>
                'required|in:CARRO,MOTO_LINEAL,MOTOTAXI',

            'placa' =>
                'required|unique:vehiculos,placa,' . $vehiculo->id,

            'marca' =>
                'required|string|max:255',

            'modelo' =>
                'required|string|max:255',

            'anio' =>
                'nullable|integer',

            'numero_motor' =>
                'nullable|string|max:255',

            'numero_chasis' =>
                'nullable|string|max:255',

            'combustible' =>
                'nullable|in:GASOLINA,DIESEL,GLP,GNV,HIBRIDO,ELECTRICO',

            'cilindrada' =>
                'nullable|string|max:255',

            'color' =>
                'nullable|string|max:255',

            'kilometraje' =>
                'nullable|integer',

            'observaciones' =>
                'nullable|string'
        ]);

        $vehiculo->update(
            $validated
        );

        return response()->json([
            'message' => 'Vehículo actualizado correctamente',
            'data' => $vehiculo
        ]);
    }

    public function destroy(
        Vehiculo $vehiculo
    ) {

        $vehiculo->update([
            'activo' => false
        ]);

        return response()->json([
            'message' => 'Vehículo desactivado correctamente'
        ]);
    }
}