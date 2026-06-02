<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEquipoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'cliente_id' => 'required|exists:clientes,id',

            'tipo_equipo' => 'required|in:CELULAR,TABLET,LAPTOP,PC',

            'marca' => 'required|string|max:100',
            'modelo' => 'required|string|max:100',

            'imei' => 'nullable|string|max:50',
            'numero_serie' => 'nullable|string|max:100',

            'procesador' => 'nullable|string|max:100',
            'ram' => 'nullable|string|max:100',
            'almacenamiento' => 'nullable|string|max:100',
            'tarjeta_video' => 'nullable|string|max:100',

            'observaciones' => 'nullable|string',

            'activo' => 'boolean'
        ];
    }
}