<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventarioMovimiento extends Model
{
    use HasFactory;

    protected $table = 'inventario_movimientos';

    protected $fillable = [
        'producto_id',
        'tipo_movimiento',
        'cantidad',
        'stock_anterior',
        'stock_nuevo',
        'motivo',
        'referencia_tipo',
        'referencia_id',
        'usuario_id',
        'observaciones',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'stock_anterior' => 'integer',
        'stock_nuevo' => 'integer',
        'referencia_id' => 'integer',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELACIONES
    |--------------------------------------------------------------------------
    */

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */

    public function scopeEntradas($query)
    {
        return $query->where('tipo_movimiento', 'ENTRADA');
    }

    public function scopeSalidas($query)
    {
        return $query->where('tipo_movimiento', 'SALIDA');
    }

    public function scopeAjustes($query)
    {
        return $query->where('tipo_movimiento', 'AJUSTE');
    }

    /*
    |--------------------------------------------------------------------------
    | CONSTANTES
    |--------------------------------------------------------------------------
    */

    const ENTRADA = 'ENTRADA';
    const SALIDA = 'SALIDA';
    const AJUSTE = 'AJUSTE';
    const DEVOLUCION = 'DEVOLUCION';
    const TRANSFERENCIA = 'TRANSFERENCIA';
}