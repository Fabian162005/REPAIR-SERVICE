<?php

namespace App\Http\Controllers\Api;

use App\Models\OrdenEstado;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrdenServicioRequest;
use App\Http\Requests\UpdateOrdenServicioRequest;
use App\Models\OrdenServicio;
use Illuminate\Http\Request;

class OrdenServicioController extends Controller
{
    public function index(Request $request)
    {
        $buscar = $request->buscar;

        $ordenes = OrdenServicio::with([
            'cliente',
            'equipo',
            'usuario',
            'tecnico'
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

    public function store(
        StoreOrdenServicioRequest $request
    ) {

        $data = $request->validated();

        $ultimoId =
            OrdenServicio::max('id') + 1;

        $data['codigo_orden'] =
            ($data['tipo_rubro'] === 'VEHICULAR'
                ? 'MEC-'
                : 'TEC-')
            .
            str_pad(
                $ultimoId,
                6,
                '0',
                STR_PAD_LEFT
            );

        $data['saldo_pendiente'] =
            ($data['total'] ?? 0)
            -
            ($data['adelanto'] ?? 0);

        $orden = OrdenServicio::create(
            $data
        );

        OrdenEstado::create([

            'orden_servicio_id' => $orden->id,

            'usuario_id' => auth()->id(),

            'estado' => $orden->estado_actual,

            'observacion' => 'Orden creada',

        ]);

        return response()->json([
            'message' =>
                'Orden creada correctamente',

            'orden' => $orden
        ], 201);
    }

    public function show(string $id)
    {
        $orden = OrdenServicio::with([

            'cliente',
            'equipo',
            'usuario',
            'tecnico',
            'estados.usuario'

        ])
        ->findOrFail($id);

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

        $data =
            $request->validated();

        $data['saldo_pendiente'] =
            ($data['total'] ?? $orden->total)
            -
            ($data['adelanto'] ?? $orden->adelanto);

        $orden->update(
            $data
        );

        $estadoAnterior =
            $orden->estado_actual;

        $orden->update($data);

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