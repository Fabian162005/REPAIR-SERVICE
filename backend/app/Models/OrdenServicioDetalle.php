<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenServicioDetalle extends Model
{
    protected $fillable = [

        'orden_servicio_id',
        'descripcion',
        'precio'

    ];

    public function orden()
    {
        return $this->belongsTo(
            OrdenServicio::class
        );
    }
}