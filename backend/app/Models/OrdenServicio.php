<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenServicio extends Model
{
    protected $table = 'orden_servicios';

    protected $fillable = [

        'codigo_orden',

        'cliente_id',
        'usuario_id',
        'tecnico_id',

        'tipo_rubro',

        'equipo_id',
        'vehiculo_id',

        'tipo_recepcion',

        'falla_reportada',

        'accesorios',
        'contrasena',

        'diagnostico_preliminar',
        'diagnostico_final',

        'estado_actual',
        'prioridad',

        'fecha_ingreso',
        'fecha_entrega_estimada',
        'fecha_entrega_real',

        'garantia_dias',

        'observaciones_cliente',
        'observaciones_tecnico',

        'recomendaciones',

        'total',
        'adelanto',
        'saldo_pendiente',
    ];

    protected $casts = [

        'fecha_ingreso' => 'datetime',

        'fecha_entrega_estimada' => 'datetime',

        'fecha_entrega_real' => 'datetime',

        'total' => 'decimal:2',

        'adelanto' => 'decimal:2',

        'saldo_pendiente' => 'decimal:2',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function equipo()
    {
        return $this->belongsTo(Equipo::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    public function tecnico()
    {
        return $this->belongsTo(
            User::class,
            'tecnico_id'
        );
    }

        public function estados()
    {
        return $this->hasMany(
            OrdenEstado::class
        )->latest();
    }

    public function detalles()
    {
        return $this->hasMany(
            OrdenServicioDetalle::class
        );
    }

    public function repuestos()
    {
        return $this->hasMany(
            OrdenRepuesto::class
        );
    }
}