<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auditoria;
use App\Models\Configuracion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NegocioController extends Controller
{
    private const COND_REC_TEC = [
        'La revisión y el diagnóstico pueden generar un costo si el cliente no autoriza la reparación.',
        'El cliente declara ser propietario del equipo o contar con la autorización de su dueño.',
        'El negocio no se responsabiliza por la pérdida de información. El cliente debe respaldar sus datos antes del servicio.',
        'Equipos con humedad, golpes o intervención previa de terceros pueden sufrir daños adicionales durante la apertura o la reparación, sin que ello genere responsabilidad para el negocio.',
        'El equipo debe retirarse dentro de los 30 días posteriores al aviso de culminación. Pasado ese plazo, el negocio no se responsabiliza por su custodia.',
        'Para retirar el equipo se debe presentar esta orden y un documento de identidad.',
        'Con su firma, el cliente acepta las presentes condiciones.',
    ];

    private const COND_REC_VEH = [
        'El cliente declara ser propietario del vehículo o contar con la autorización de su dueño.',
        'El presupuesto es referencial. Los trabajos adicionales se ejecutarán solo con la autorización del cliente.',
        'El cliente autoriza las pruebas de manejo necesarias para el diagnóstico y la verificación del trabajo.',
        'El negocio no se responsabiliza por objetos de valor ni accesorios no declarados en esta orden.',
        'El vehículo debe retirarse dentro de los 30 días posteriores al aviso de culminación. Pasado ese plazo, el negocio podrá cobrar por su custodia.',
        'Los repuestos reemplazados quedan a disposición del cliente si los solicita al momento de la entrega.',
        'Para retirar el vehículo se debe presentar esta orden y un documento de identidad.',
        'Con su firma, el cliente acepta las presentes condiciones.',
    ];

    private const COND_ENTREGA = [
        'El cliente recibe el equipo o vehículo a su entera conformidad, tras haber revisado el trabajo realizado.',
        'La garantía cubre únicamente el servicio realizado y los repuestos instalados, por el plazo indicado en este documento.',
        'La garantía no cubre daños por mal uso, humedad, golpes, sobrecargas o manipulación por terceros.',
        'Para hacer efectiva la garantía se debe presentar este documento.',
    ];

    public function show()
    {
        return response()->json(['success' => true, 'data' => $this->datos()]);
    }

    public function update(Request $request)
    {
        $d = $request->validate([
            'nombre'        => 'required|string|max:120',
            'ruc'           => 'nullable|string|max:20',
            'direccion'     => 'nullable|string|max:255',
            'telefono'      => 'nullable|string|max:30',
            'garantia_dias' => 'nullable|integer|min:0|max:3650',
            'cond_rec_tec'  => 'nullable|string|max:3000',
            'cond_rec_veh'  => 'nullable|string|max:3000',
            'cond_entrega'  => 'nullable|string|max:3000',
        ]);

        foreach ($d as $clave => $valor) {
            Configuracion::guardar("negocio_{$clave}", $valor ?? '');
        }

        Auditoria::registrar('EDITAR_NEGOCIO', 'negocio', null, ['campos' => array_keys($d)]);

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
        $gar  = Configuracion::obtener('negocio_garantia_dias');

        return [
            'nombre'        => Configuracion::obtener('negocio_nombre', ''),
            'ruc'           => Configuracion::obtener('negocio_ruc', ''),
            'direccion'     => Configuracion::obtener('negocio_direccion', ''),
            'telefono'      => Configuracion::obtener('negocio_telefono', ''),
            'logo_url'      => $logo ? url('storage/' . $logo) : null,
            'garantia_dias' => ($gar === null || $gar === '') ? 30 : (int) $gar,
            'cond_rec_tec'  => Configuracion::obtener('negocio_cond_rec_tec') ?: implode("\n", self::COND_REC_TEC),
            'cond_rec_veh'  => Configuracion::obtener('negocio_cond_rec_veh') ?: implode("\n", self::COND_REC_VEH),
            'cond_entrega'  => Configuracion::obtener('negocio_cond_entrega') ?: implode("\n", self::COND_ENTREGA),
        ];
    }
}