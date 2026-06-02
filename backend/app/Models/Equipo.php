<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    protected $fillable = [

        'cliente_id',

        'tipo_equipo',

        'marca',
        'modelo',

        'imei',
        'numero_serie',

        'procesador',
        'ram',
        'almacenamiento',
        'tarjeta_video',

        'observaciones',

        'activo'
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function ordenesServicio()
{
    return $this->hasMany(
        OrdenServicio::class
    );
}
}