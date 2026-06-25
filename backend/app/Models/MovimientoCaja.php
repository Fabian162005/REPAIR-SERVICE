<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovimientoCaja extends Model
{
    //

    protected $table = 'movimientos_caja';

    protected $fillable = [

    'tipo_movimiento',

    'origen',

    'tipo_rubro',

    'orden_servicio_id',

    'usuario_id',

    'monto',

    'descripcion',

    'observacion',

    'fecha_movimiento'
];

public function ordenServicio()
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
