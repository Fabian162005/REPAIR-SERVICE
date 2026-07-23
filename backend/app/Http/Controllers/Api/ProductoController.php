<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;
use App\Http\Resources\ProductoResource;
use App\Models\Producto;
use App\Services\ProductoService;
use Illuminate\Http\JsonResponse;
use Exception;

class ProductoController extends Controller
{
    protected ProductoService $productoService;

    public function __construct(ProductoService $productoService)
    {
        $this->productoService = $productoService;
    }

    /**
     * Listar productos.
     */
    public function index(): JsonResponse
    {
        try {

            $productos = Producto::with('categoria')
            ->activos()
            ->orderBy('nombre')
            ->get();

            return response()->json([
                'success' => true,
                'message' => 'Productos obtenidos correctamente.',
                'data' => ProductoResource::collection($productos)
            ]);

        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los productos.',
                'error' => $e->getMessage()
            ], 500);

        }
    }

    /**
     * Registrar producto.
     */
    public function store(StoreProductoRequest $request): JsonResponse
    {
        try {

            $producto = $this->productoService->store(
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'message' => 'Producto registrado correctamente.',
                'data' => new ProductoResource($producto)
            ], 201);

        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al registrar el producto.',
                'error' => $e->getMessage()
            ], 500);

        }
    }

    /**
     * Mostrar un producto.
     */
    public function show(Producto $producto): JsonResponse
    {
        try {

            $producto->load('categoria');

            return response()->json([
                'success' => true,
                'data' => new ProductoResource($producto)
            ]);

        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado.',
                'error' => $e->getMessage()
            ], 404);

        }
    }

    /**
     * Actualizar producto.
     */
    public function update(UpdateProductoRequest $request, Producto $producto): JsonResponse
    {
        try {

$producto = $this->productoService->update(
    $producto,
    $request->validated()
);

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado correctamente.',
                'data' => new ProductoResource(
                    $producto->fresh('categoria')
                )
            ]);

        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el producto.',
                'error' => $e->getMessage()
            ], 500);

        }
    }

    /**
     * Eliminar producto (eliminación lógica).
     */
    public function destroy(Producto $producto): JsonResponse
    {
        try {

            $producto->update([
                'activo' => false
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Producto desactivado correctamente.'
            ]);

        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el producto.',
                'error' => $e->getMessage()
            ], 500);

        }
    }
}