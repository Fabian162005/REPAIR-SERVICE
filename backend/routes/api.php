<?php
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CajaController;
use App\Http\Controllers\Api\CategoriaProductoController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\EquipoController;
use App\Http\Controllers\Api\MovimientoCajaController;
use App\Http\Controllers\Api\MovimientoController;
use App\Http\Controllers\Api\OrdenArchivoController;
use App\Http\Controllers\Api\OrdenPagoController;
use App\Http\Controllers\Api\OrdenServicioController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\VehiculoController;
use App\Http\Controllers\Api\VentaRepuestoController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

// Catálogos (siguen públicos por ahora)
Route::apiResource('clientes', ClienteController::class);
Route::apiResource('equipos', EquipoController::class);
Route::apiResource('vehiculos', VehiculoController::class);
Route::apiResource('categorias-producto', CategoriaProductoController::class);

Route::post('orden-archivos', [OrdenArchivoController::class, 'store']);
Route::delete('orden-archivos/{id}', [OrdenArchivoController::class, 'destroy']);

Route::middleware(['auth:sanctum', 'activo'])->group(function () {
    
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ---------- Para todos los usuarios ----------
    Route::apiResource('productos', ProductoController::class)->only(['index', 'show']);

    Route::get('orden-pagos/{ordenId}', [OrdenPagoController::class, 'index']);
    Route::post('orden-pagos', [OrdenPagoController::class, 'store']);

    Route::get('caja/actual', [CajaController::class, 'actual']);
    Route::post('caja/abrir', [CajaController::class, 'abrir'])->middleware('throttle:5,1');
    Route::post('caja/cerrar', [CajaController::class, 'cerrar'])->middleware('throttle:5,1');
    Route::post('caja/egresos', [CajaController::class, 'egreso']);
    Route::get('caja/historial', [CajaController::class, 'historial']);

    Route::get('ventas-repuesto', [VentaRepuestoController::class, 'index']);
    Route::post('ventas-repuesto', [VentaRepuestoController::class, 'store']);

    Route::get('productos/{producto}/movimientos', [MovimientoController::class, 'index']);

    Route::apiResource('ordenes-servicio', OrdenServicioController::class)->only(['index', 'show', 'store', 'update']);
    Route::patch('ordenes-servicio/{id}/estado', [OrdenServicioController::class, 'cambiarEstado']);

    // ---------- Solo administrador ----------
    Route::middleware('admin')->group(function () {

        Route::apiResource('productos', ProductoController::class)->only(['store', 'update', 'destroy']);
        Route::post('productos/{producto}/movimientos', [MovimientoController::class, 'store']);

        Route::delete('orden-pagos/{id}', [OrdenPagoController::class, 'destroy']);

        Route::get('caja/general', [CajaController::class, 'general']);
        Route::delete('caja/movimientos/{id}', [CajaController::class, 'anularMovimiento']);
        Route::put('caja/pin', [CajaController::class, 'cambiarPin']);
        Route::get('caja/pin/estado', [CajaController::class, 'estadoPin']);

        Route::post('ventas-repuesto/{venta}/anular', [VentaRepuestoController::class, 'anular']);

        Route::apiResource('ordenes-servicio', OrdenServicioController::class)->only(['destroy']);

        Route::post('caja/{caja}/reabrir', [CajaController::class, 'reabrir'])->middleware('throttle:5,1');
        Route::post('caja/{caja}/ajustar', [CajaController::class, 'ajustar'])->middleware('throttle:5,1');

        Route::get('usuarios', [UserController::class, 'index']);
        Route::post('usuarios', [UserController::class, 'store']);
        Route::put('usuarios/{user}', [UserController::class, 'update']);
        Route::put('usuarios/{user}/password', [UserController::class, 'resetPassword']);

        // CRUD antiguo de movimientos: se salta la lógica de caja, por eso queda solo para admin
        Route::apiResource('movimientos-caja', MovimientoCajaController::class);
    });
});