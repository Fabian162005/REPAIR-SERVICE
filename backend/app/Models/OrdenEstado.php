<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenEstado extends Model
{
    protected $fillable = [

        'orden_servicio_id',
        'usuario_id',
        'estado',
        'observacion',

    ];

    public function orden()
    {
        return $this->belongsTo(
            OrdenServicio::class,
            'orden_servicio_id'
        );
    }

    public function usuario()
    {
        return $this->belongsTo(
            User::class
        );
    }
}