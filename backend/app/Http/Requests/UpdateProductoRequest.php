<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Reglas de validación.
     */
    public function rules()
    {
        return [

            'nombre' => 'required|string|max:255',

            'descripcion' => 'nullable|string',

            'categoria_id' => 'required|exists:categoria_productos,id',

            'precio_compra' => 'required|numeric|min:0',

            'precio_venta' => 'required|numeric|gte:precio_compra',

            'stock_minimo' => 'required|integer|min:0',

            'unidad_medida' => 'required|string|max:30',

            'codigo_barras' => 'nullable|string|max:100',

            'activo' => 'required|boolean',

        ];
    }

    /**
     * Mensajes personalizados.
     */
    public function messages()
    {
        return [

            'nombre.required' => 'El nombre del producto es obligatorio.',

            'categoria_id.required' => 'Debe seleccionar una categoría.',

            'categoria_id.exists' => 'La categoría seleccionada no existe.',

            'precio_compra.required' => 'Debe ingresar el precio de compra.',

            'precio_compra.numeric' => 'El precio de compra debe ser numérico.',

            'precio_venta.required' => 'Debe ingresar el precio de venta.',

            'precio_venta.numeric' => 'El precio de venta debe ser numérico.',

            'precio_venta.gte' => 'El precio de venta no puede ser menor al precio de compra.',

            'stock_minimo.required' => 'Debe ingresar el stock mínimo.',

            'stock_minimo.integer' => 'El stock mínimo debe ser un número entero.',

            'stock_minimo.min' => 'El stock mínimo no puede ser negativo.',

        ];
    }
}