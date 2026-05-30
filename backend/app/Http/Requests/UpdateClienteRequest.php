<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClienteRequest extends FormRequest
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
     */
    public function rules(): array
    {
        $clienteId = $this->route('cliente');

        return [

            'tipo_documento' => 'required|in:DNI,RUC,CE,PASAPORTE',

            'numero_documento' =>
                'required|max:20|unique:clientes,numero_documento,' . $clienteId,

            'nombres' => 'required|max:255',

            'apellidos' => 'nullable|max:255',

            'razon_social' => 'nullable|max:255',

            'celular' => 'nullable|max:20',

            'correo' => 'nullable|email|max:255',

            'direccion' => 'nullable|max:255',

            'distrito' => 'nullable|max:255',

            'ciudad' => 'nullable|max:255',

            'observaciones' => 'nullable',
        ];
    }
}