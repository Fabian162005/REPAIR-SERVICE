<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipo;
use App\Http\Requests\StoreEquipoRequest;
use App\Http\Requests\UpdateEquipoRequest;
use Illuminate\Http\Request;

class EquipoController extends Controller
{
    public function index(Request $request)
    {
        $buscar = $request->buscar;

        $equipos = Equipo::with('cliente')

            ->when($buscar, function ($query) use ($buscar) {

                $query->where('marca', 'LIKE', "%{$buscar}%")
                    ->orWhere('modelo', 'LIKE', "%{$buscar}%")
                    ->orWhere('imei', 'LIKE', "%{$buscar}%");
            })

            ->latest()
            ->paginate(10);

        return response()->json($equipos);
    }

    public function store(StoreEquipoRequest $request)
    {
        $equipo = Equipo::create(
            $request->validated()
        );

        return response()->json([
            'message' => 'Equipo creado correctamente',
            'equipo' => $equipo
        ], 201);
    }

    public function show(string $id)
    {
        $equipo = Equipo::with('cliente')
            ->findOrFail($id);

        return response()->json($equipo);
    }

    public function update(
        UpdateEquipoRequest $request,
        string $id
    ) {

        $equipo = Equipo::findOrFail($id);

        $equipo->update(
            $request->validated()
        );

        return response()->json([
            'message' => 'Equipo actualizado correctamente',
            'equipo' => $equipo
        ]);
    }

    public function destroy(string $id)
    {
        $equipo = Equipo::findOrFail($id);

        $equipo->delete();

        return response()->json([
            'message' => 'Equipo eliminado correctamente'
        ]);
    }
}