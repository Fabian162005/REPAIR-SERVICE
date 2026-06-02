<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    
    protected $table = 'clientes';

    protected $fillable = [

        'tipo_documento',
        'numero_documento',

        'nombres',
        'apellidos',
        'razon_social',

        'celular',
        'correo',
        'direccion',
        'distrito',
        'ciudad',

        'observaciones',

        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];
    
        public function equipos()
    {
        return $this->hasMany(Equipo::class);
    }

    public function ordenesServicio()
{
    return $this->hasMany(
        OrdenServicio::class
    );
}
}

