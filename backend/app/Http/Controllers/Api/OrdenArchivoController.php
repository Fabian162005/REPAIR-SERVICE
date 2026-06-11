<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrdenArchivo;

class OrdenArchivoController extends Controller
{
    public function store(Request $request)
{
    $request->validate([

        'orden_servicio_id' =>
            'required|exists:orden_servicios,id',

        'tipo' =>
            'required|string',

        'archivo' =>
            'required|file|max:10240'
    ]);

    $file =
        $request->file('archivo');

    $path =
        $file->store(
            'ordenes',
            'public'
        );

    $archivo =
        OrdenArchivo::create([

            'orden_servicio_id' =>
                $request->orden_servicio_id,

            'nombre_original' =>
                $file->getClientOriginalName(),

            'archivo' =>
                $path,

            'tipo' =>
                $request->tipo
        ]);

    return response()->json(
        $archivo
    );
}

public function destroy($id)
{
    $archivo =
        OrdenArchivo::findOrFail($id);

    Storage::disk('public')
        ->delete(
            $archivo->archivo
        );

    $archivo->delete();

    return response()->json([
        'message' => 'Archivo eliminado'
    ]);
}

}
