<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auditoria extends Model
{
    protected $table = 'auditorias';

    protected $fillable = ['usuario_id', 'accion', 'entidad', 'entidad_id', 'detalle'];

    protected $casts = ['detalle' => 'array'];

    public static function registrar(string $accion, string $entidad, ?int $id = null, array $detalle = []): void
    {
        static::create([
            'usuario_id' => auth()->id(),
            'accion'     => $accion,
            'entidad'    => $entidad,
            'entidad_id' => $id,
            'detalle'    => $detalle,
        ]);
    }
}