<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovimientoCaja extends Model
{
    protected $table = 'movimientos_caja';

    protected $fillable = [
        'caja_id',
        'tipo_movimiento',
        'origen',
        'tipo_rubro',
        'orden_servicio_id',
        'orden_pago_id',
        'venta_repuesto_id',
        'usuario_id',
        'monto',
        'metodo_pago',
        'descripcion',
        'observacion',
        'fecha_movimiento',
        'anulado',
    ];

    protected $casts = [
        'monto'            => 'decimal:2',
        'fecha_movimiento' => 'datetime',
        'anulado'          => 'boolean',
    ];

    public function caja()
    {
        return $this->belongsTo(Caja::class, 'caja_id');
    }

    public function ordenServicio()
    {
        return $this->belongsTo(OrdenServicio::class, 'orden_servicio_id');
    }

    public function ordenPago()
    {
        return $this->belongsTo(OrdenPago::class, 'orden_pago_id');
    }

    public function ventaRepuesto()
    {
        return $this->belongsTo(VentaRepuesto::class, 'venta_repuesto_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function scopeVigentes($q)
    {
        return $q->where('anulado', false);
    }
}