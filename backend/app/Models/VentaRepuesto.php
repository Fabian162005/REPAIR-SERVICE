<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaRepuesto extends Model
{
    protected $table = 'venta_repuestos';

    protected $fillable = [
        'codigo', 'usuario_id', 'cliente_id', 'tipo_rubro',
        'total', 'metodo_pago', 'estado', 'observaciones',
    ];

    protected $casts = ['total' => 'decimal:2'];

    public function detalles()
    {
        return $this->hasMany(VentaRepuestoDetalle::class, 'venta_repuesto_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function movimientosCaja()
    {
        return $this->hasMany(MovimientoCaja::class, 'venta_repuesto_id');
    }
}