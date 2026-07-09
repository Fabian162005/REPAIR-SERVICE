<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrdenServicioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'cliente_id' =>
                'required|exists:clientes,id',

            'equipo_id' =>
                'required_if:tipo_rubro,TECNOLOGIA|nullable|exists:equipos,id',

            'vehiculo_id' =>
                'required_if:tipo_rubro,VEHICULAR|nullable|exists:vehiculos,id',

            'tipo_rubro' =>
                'required|in:TECNOLOGIA,VEHICULAR',

            'falla_reportada' =>
                'required|string',

            'accesorios' =>
                'nullable|string',

                'checklist_recepcion' =>
            'nullable|string',

            'recepcion_vehicular' =>
            'nullable|array',

        'diagnostico_vehicular' =>
            'nullable|array',

        'checklist_vehicular' =>
            'nullable|array',

        'servicios_vehiculares' =>
            'nullable|array',

        'proximo_mantenimiento' =>
            'nullable|array',

            'contrasena' =>
                'nullable|string|max:100',

            'observaciones_cliente' =>
                'nullable|string',

            'prioridad' =>
                'nullable|in:BAJA,MEDIA,ALTA,URGENTE',

            'fecha_ingreso' =>
                'required|date',

            'total' =>
                'nullable|numeric',

            'adelanto' =>
                'nullable|numeric',

            'saldo_pendiente' =>
                'nullable|numeric',
                
            'diagnostico_preliminar' =>
                'nullable|string',

            'diagnostico_final' =>
                'nullable|string',

            'estado_actual' => [
                'nullable',
                'in:RECEPCIONADO,DIAGNOSTICO,ESPERANDO_APROBACION,EN_REPARACION,REPARADO,ENTREGADO,CANCELADO'
            ],

            'detalles' => 'nullable|array',

            'detalles.*.descripcion' =>
                'required|string',

            'detalles.*.precio' =>
                'required|numeric',

            'repuestos' => 'nullable|array',

            'repuestos.*.nombre' =>
                'required|string',

            'repuestos.*.cantidad' =>
                'required|numeric',

            'repuestos.*.precio_unitario' =>
                'required|numeric',
        ];
    }
}