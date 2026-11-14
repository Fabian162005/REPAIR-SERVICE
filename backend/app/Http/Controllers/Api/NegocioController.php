<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auditoria;
use App\Models\Configuracion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NegocioController extends Controller
{
    public function show()
    {
        return response()->json(['success' => true, 'data' => $this->datos()]);
    }

    public function update(Request $request)
    {
        $d = $request->validate([
            'nombre'    => 'required|string|max:120',
            'ruc'       => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255',
            'telefono'  => 'nullable|string|max:30',
        ]);

        foreach ($d as $clave => $valor) {
            Configuracion::guardar("negocio_{$clave}", $valor ?? '');
        }

        Auditoria::registrar('EDITAR_NEGOCIO', 'negocio', null, $d);

        return response()->json([
            'success' => true,
            'message' => 'Datos del negocio guardados.',
            'data'    => $this->datos(),
        ]);
    }

    public function logo(Request $request)
    {
        // Sin SVG a propósito: puede contener scripts
        $request->validate([
            'logo' => 'required|image|mimes:png,jpg,jpeg,webp|max:1024',
        ]);

        $anterior = Configuracion::obtener('negocio_logo');

        $ruta = $request->file('logo')->store('logos', 'public');

        Configuracion::guardar('negocio_logo', $ruta);

        if ($anterior) {
            Storage::disk('public')->delete($anterior);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logo actualizado.',
            'data'    => $this->datos(),
        ]);
    }

    private function datos(): array
    {
        $logo = Configuracion::obtener('negocio_logo');

        return [
            'nombre'    => Configuracion::obtener('negocio_nombre', ''),
            'ruc'       => Configuracion::obtener('negocio_ruc', ''),
            'direccion' => Configuracion::obtener('negocio_direccion', ''),
            'telefono'  => Configuracion::obtener('negocio_telefono', ''),
            'logo_url'  => $logo ? url('storage/' . $logo) : null,
        ];
    }
}