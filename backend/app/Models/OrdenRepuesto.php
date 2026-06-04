<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenRepuesto extends Model
{
    protected $fillable = [

        'orden_servicio_id',

        'nombre',

        'cantidad',

        'precio_unitario',

        'subtotal'

    ];
}