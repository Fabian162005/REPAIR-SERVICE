<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventarioMovimientoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
{
    return [
        'id'              => $this->id,
        'tipo_movimiento' => $this->tipo_movimiento,
        'cantidad'        => $this->cantidad,
        'stock_anterior'  => $this->stock_anterior,
        'stock_nuevo'     => $this->stock_nuevo,
        'motivo'          => $this->motivo,
        'referencia_tipo' => $this->referencia_tipo,
        'referencia_id'   => $this->referencia_id,
        'observaciones'   => $this->observaciones,
        'usuario'         => optional($this->usuario)->name,
        'fecha'           => $this->created_at->format('d/m/Y H:i'),
    ];
}
}
