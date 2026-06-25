<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMovimientoCajaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
   public function authorize(): bool
{
    return true;
}

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
{
    return [
        'tipo_movimiento' => 'sometimes|required',
        'origen' => 'sometimes|required',
        'tipo_rubro' => 'sometimes|required',
        'usuario_id' => 'required|exists:users,id',
        'monto' => 'sometimes|required|numeric',
        'descripcion' => 'nullable|string',
        'observacion' => 'nullable|string',
        'fecha_movimiento' => 'sometimes|required|date'
    ];
}
}
