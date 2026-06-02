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
                
        ];
    }
}