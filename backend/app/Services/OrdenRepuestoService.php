<?php

namespace App\Services;

use App\Models\InventarioMovimiento;
use App\Models\OrdenRepuesto;
use App\Models\OrdenServicio;
use App\Models\Producto;

class OrdenRepuestoService
{
    public function __construct(private MovimientoService $movimientos) {}

    public function sincronizar(OrdenServicio $orden, array $nuevos): void
    {
        $anteriores = $orden->repuestos()->whereNotNull('producto_id')->get()
            ->groupBy('producto_id')->map(fn ($g) => $g->sum('cantidad'));

        $nuevosMap = collect($nuevos)->filter(fn ($r) => !empty($r['producto_id']))
            ->groupBy('producto_id')->map(fn ($g) => $g->sum('cantidad'));

        foreach ($anteriores->keys()->merge($nuevosMap->keys())->unique() as $pid) {
            $delta = $nuevosMap->get($pid, 0) - $anteriores->get($pid, 0);

            if ($delta > 0) {
                $this->movimientos->registrar(
                    $pid, InventarioMovimiento::SALIDA, $delta,
                    'USO EN ORDEN', 'ORDEN', $orden->id, $orden->codigo_orden
                );
            } elseif ($delta < 0) {
                $this->movimientos->registrar(
                    $pid, InventarioMovimiento::ENTRADA, abs($delta),
                    'DEVOLUCION', 'ORDEN', $orden->id, $orden->codigo_orden
                );
            }
        }

        $orden->repuestos()->delete();

        foreach ($nuevos as $r) {
            $producto = !empty($r['producto_id']) ? Producto::find($r['producto_id']) : null;

            OrdenRepuesto::create([
                'orden_servicio_id' => $orden->id,
                'producto_id'       => $producto?->id,
                'nombre'            => $r['nombre'] ?? $producto?->nombre,
                'cantidad'          => $r['cantidad'],
                'precio_unitario'   => $r['precio_unitario'],
                'subtotal'          => $r['subtotal'],
            ]);
        }
    }

    public function revertir(OrdenServicio $orden): void
    {
        $this->sincronizar($orden, []); // devuelve todo el stock y borra los repuestos
    }
}