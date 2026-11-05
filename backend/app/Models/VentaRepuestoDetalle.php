<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaRepuestoDetalle extends Model
{
    protected $table = 'venta_repuesto_detalles';

    protected $fillable = [
        'venta_repuesto_id', 'producto_id',
        'cantidad', 'precio_unitario', 'subtotal',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function venta()
    {
        return $this->belongsTo(VentaRepuesto::class, 'venta_repuesto_id');
    }
}