<?php

namespace App\Services;

use App\Models\CategoriaProducto;
use App\Models\InventarioMovimiento;
use App\Models\Producto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProductoService
{
    /**
     * Crear un nuevo producto.
     */
    public function store(array $data): Producto
    {
        return DB::transaction(function () use ($data) {

            $categoria = CategoriaProducto::findOrFail($data['categoria_id']);

            $codigo = $this->generarCodigo($categoria->tipo_rubro);


            $producto = Producto::create([
                'codigo' => $codigo,
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'] ?? null,
                'categoria_id' => $data['categoria_id'],
                'precio_compra' => $data['precio_compra'],
                'precio_venta' => $data['precio_venta'],
                'stock_actual' => $data['stock_actual'],
                'stock_minimo' => $data['stock_minimo'],
                'unidad_medida' => $data['unidad_medida'],
                'codigo_barras' => $data['codigo_barras'] ?? null,
                'activo' => $data['activo'] ?? true,
            ]);

            if ($producto->stock_actual > 0) {
                $this->crearMovimientoInicial($producto);
            }

            return $producto->fresh('categoria');
        });
    }

/**
 * Actualizar producto.
 */
public function update(Producto $producto, array $data): Producto
{
    return DB::transaction(function () use ($producto, $data) {


        /*
        |--------------------------------------------------------------------------
        | Si cambia la categoría,
        | revisamos el nuevo rubro
        |--------------------------------------------------------------------------
        */

        if(
            isset($data['categoria_id']) &&
            $data['categoria_id'] != $producto->categoria_id
        ){

            $categoria =
                CategoriaProducto::findOrFail(
                    $data['categoria_id']
                );


            // Genera nuevo código según rubro

            $data['codigo'] =
                $this->generarCodigo(
                    $categoria->tipo_rubro
                );

        }



        $producto->update($data);



        return $producto->fresh('categoria');


    });
}

    /**
     * Generar código automático.
     */
    private function generarCodigo(string $rubro): string
    {
        $prefijo = $this->obtenerPrefijo($rubro);

        $ultimo = Producto::where('codigo', 'like', $prefijo . '-%')
            ->orderByDesc('id')
            ->first();

        if (!$ultimo) {
            return $prefijo . '-000001';
        }

        $numero = (int) substr($ultimo->codigo, -6);

        $numero++;

        return $prefijo . '-' . str_pad($numero, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Obtener prefijo según el rubro.
     */
    private function obtenerPrefijo(string $rubro): string
    {
        return match (strtoupper($rubro)) {
            'TECNOLOGIA' => 'PRDTEC',
            'VEHICULAR' => 'PRDVEH',
            default => 'PRD',
        };
    }

    /**
     * Registrar movimiento inicial.
     */
    private function crearMovimientoInicial(Producto $producto): void
    {
        InventarioMovimiento::create([

            'producto_id' => $producto->id,

            'tipo_movimiento' => InventarioMovimiento::ENTRADA,

            'cantidad' => $producto->stock_actual,

            'stock_anterior' => 0,

            'stock_nuevo' => $producto->stock_actual,

            'motivo' => 'STOCK INICIAL',

            'referencia_tipo' => 'STOCK_INICIAL',

            'referencia_id' => null,

            'usuario_id' => Auth::id(),

            'observaciones' => 'Registro inicial del producto.'

        ]);
    }
}