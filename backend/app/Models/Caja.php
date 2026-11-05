<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caja extends Model
{
    protected $table = 'cajas';

    protected $fillable = [
        'usuario_id', 'fecha', 'monto_apertura',
        'efectivo_esperado', 'efectivo_contado', 'diferencia',
        'estado', 'abierta_at', 'cerrada_at', 'observaciones',
    ];

    protected $casts = [
        'fecha'             => 'date:Y-m-d',
        'monto_apertura'    => 'decimal:2',
        'efectivo_esperado' => 'decimal:2',
        'efectivo_contado'  => 'decimal:2',
        'diferencia'        => 'decimal:2',
        'abierta_at'        => 'datetime',
        'cerrada_at'        => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoCaja::class, 'caja_id');
    }

    public function scopeAbiertas($q)
    {
        return $q->where('estado', 'ABIERTA');
    }
}