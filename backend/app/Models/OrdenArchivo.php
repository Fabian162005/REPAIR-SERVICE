<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenArchivo extends Model
{
    protected $fillable = [

        'orden_servicio_id',

        'nombre_original',

        'archivo',

        'tipo'
    ];

    public function ordenServicio()
    {
        return $this->belongsTo(
            OrdenServicio::class
        );
    }
}