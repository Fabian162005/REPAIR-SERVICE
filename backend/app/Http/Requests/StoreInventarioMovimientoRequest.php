<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreInventarioMovimientoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
   public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'tipo_movimiento' => 'required|in:ENTRADA,SALIDA',
            'cantidad'        => 'required|integer|min:1',
            'motivo'          => 'required|string|max:100',
            'observaciones'   => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'tipo_movimiento.in' => 'El tipo debe ser ENTRADA o SALIDA.',
            'cantidad.min'       => 'La cantidad debe ser mayor a 0.',
            'motivo.required'    => 'Debe indicar el motivo.',
        ];
    }
}
