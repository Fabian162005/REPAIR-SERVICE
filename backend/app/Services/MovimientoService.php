<?php

namespace App\Services;

use App\Models\InventarioMovimiento;
use App\Models\Producto;
use DomainException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MovimientoService
{
    public function registrar(
        int $productoId,
        string $tipo,
        int $cantidad,
        string $motivo,
        ?string $refTipo = null,
        ?int $refId = null,
        ?string $obs = null
    ): InventarioMovimiento {

        return DB::transaction(function () use ($productoId, $tipo, $cantidad, $motivo, $refTipo, $refId, $obs) {

            if ($cantidad <= 0) {
                throw new DomainException('La cantidad debe ser mayor a 0.');
            }

            // Bloquea la fila para que dos operaciones no pisen el mismo stock
            $producto = Producto::lockForUpdate()->findOrFail($productoId);

            $anterior = $producto->stock_actual;

            $nuevo = $tipo === InventarioMovimiento::ENTRADA
                ? $anterior + $cantidad
                : $anterior - $cantidad;

            if ($nuevo < 0) {
                throw new DomainException(
                    "Stock insuficiente de \"{$producto->nombre}\". Disponible: {$anterior}."
                );
            }

            $producto->update(['stock_actual' => $nuevo]);

            return InventarioMovimiento::create([
                'producto_id'     => $producto->id,
                'tipo_movimiento' => $tipo,
                'cantidad'        => $cantidad,
                'stock_anterior'  => $anterior,
                'stock_nuevo'     => $nuevo,
                'motivo'          => $motivo,
                'referencia_tipo' => $refTipo,
                'referencia_id'   => $refId,
                'usuario_id'      => Auth::id(),
                'observaciones'   => $obs,
            ]);
        });
    }
}