<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenPago extends Model
{
    protected $fillable = [

        'orden_servicio_id',
        'usuario_id',

        'monto',

        'metodo_pago',

        'observacion'
    ];

    public function orden()
    {
        return $this->belongsTo(
            OrdenServicio::class
        );
    }

    public function usuario()
    {
        return $this->belongsTo(
            User::class
        );
    }
}