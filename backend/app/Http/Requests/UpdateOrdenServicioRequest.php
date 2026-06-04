<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrdenServicioRequest extends FormRequest
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
                'nullable|exists:equipos,id',

            'tipo_rubro' =>
                'required|in:TECNOLOGIA,VEHICULAR',

            'falla_reportada' =>
                'required|string',

            'accesorios' =>
                'nullable|string',

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