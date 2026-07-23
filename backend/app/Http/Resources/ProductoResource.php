<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [

            'id' => $this->id,

            'codigo' => $this->codigo,

            'nombre' => $this->nombre,

            'descripcion' => $this->descripcion,

            'categoria_id' => $this->categoria_id,

            'categoria' => [
                'id' => optional($this->categoria)->id,
                'nombre' => optional($this->categoria)->nombre,
                'tipo_rubro' => optional($this->categoria)->tipo_rubro,
            ],

            'precio_compra' => (float) $this->precio_compra,

            'precio_venta' => (float) $this->precio_venta,

            'stock_actual' => $this->stock_actual,

            'stock_minimo' => $this->stock_minimo,

            'unidad_medida' => $this->unidad_medida,

            'codigo_barras' => $this->codigo_barras,

            'activo' => $this->activo,

            'tiene_stock' => $this->stock_actual > 0,

            'stock_bajo' => $this->stock_actual <= $this->stock_minimo,

            'created_at' => optional($this->created_at)->format('d/m/Y H:i'),

            'updated_at' => optional($this->updated_at)->format('d/m/Y H:i'),

        ];
    }
}