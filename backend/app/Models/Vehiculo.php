<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $fillable = [

        'cliente_id',

        'tipo_vehiculo',

        'placa',

        'marca',

        'modelo',

        'anio',

        'numero_motor',

        'numero_chasis',

        'combustible',

        'cilindrada',

        'color',

        'kilometraje',

        'observaciones',

        'activo'
    ];

    protected $casts = [

        'activo' => 'boolean'
    ];

    public function cliente()
    {
        return $this->belongsTo(
            Cliente::class
        );
    }

    public function ordenes()
    {
        return $this->hasMany(
            OrdenServicio::class,
            'vehiculo_id'
        );
    }
}