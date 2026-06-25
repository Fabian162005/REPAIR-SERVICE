<?php

use App\Http\Controllers\Api\OrdenServicioController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\EquipoController;
use App\Http\Controllers\Api\OrdenArchivoController;
use App\Http\Controllers\Api\OrdenPagoController;
use App\Http\Controllers\Api\VehiculoController;
use App\Http\Controllers\Api\MovimientoCajaController;

Route::post('/login', [AuthController::class, 'login']);

Route::apiResource('clientes', ClienteController::class);
Route::apiResource('equipos', EquipoController::class);
Route::apiResource('ordenes-servicio', OrdenServicioController::class);
Route::apiResource(
    'vehiculos',
    VehiculoController::class
);

Route::apiResource(
    'movimientos-caja',
    MovimientoCajaController::class
);

Route::post(
        'orden-archivos',
        [OrdenArchivoController::class, 'store']
    );

    Route::delete(
        'orden-archivos/{id}',
        [OrdenArchivoController::class, 'destroy']
    );

    Route::get(
    'orden-pagos/{ordenId}',
    [OrdenPagoController::class, 'index']
);

Route::post(
    'orden-pagos',
    [OrdenPagoController::class, 'store']
);

Route::delete(
    'orden-pagos/{id}',
    [OrdenPagoController::class, 'destroy']
);


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

   
});
