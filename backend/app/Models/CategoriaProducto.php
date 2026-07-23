<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoriaProducto extends Model
{
    protected $table = "categoria_productos";

    protected $fillable = [
        'nombre',
        'tipo_rubro',
        'activo'
    ];

    public function productos()
    {
    return $this->hasMany(Producto::class, 'categoria_id');
    }
}