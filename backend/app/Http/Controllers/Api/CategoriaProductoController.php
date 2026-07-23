<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoriaProductoRequest;
use App\Models\CategoriaProducto;

class CategoriaProductoController extends Controller
{
    public function index()
    {
        return CategoriaProducto::where('activo', true)
            ->orderBy('nombre')
            ->get();
    }

    public function store(StoreCategoriaProductoRequest $request)
    {
        $categoria = CategoriaProducto::create(
            $request->validated()
        );

        return response()->json([
            'message' => 'Categoría registrada correctamente',
            'data' => $categoria
        ], 201);
    }

    public function show(CategoriaProducto $categoriaProducto)
    {
        return $categoriaProducto;
    }

    public function update(
        StoreCategoriaProductoRequest $request,
        CategoriaProducto $categoriaProducto
    ) {

        $categoriaProducto->update(
            $request->validated()
        );

        return response()->json([
            'message' => 'Categoría actualizada correctamente',
            'data' => $categoriaProducto
        ]);

    }

    public function destroy(
        CategoriaProducto $categoriaProducto
    ) {

        $categoriaProducto->update([
            'activo' => false
        ]);

        return response()->json([
            'message' => 'Categoría eliminada correctamente'
        ]);

    }
}