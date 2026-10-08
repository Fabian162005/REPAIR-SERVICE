<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenRepuesto extends Model
{
    protected $fillable = [
        'orden_servicio_id',
        'producto_id',
        'nombre',
        'cantidad',
        'precio_unitario',
        'subtotal',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}