<?php

use App\Http\Controllers\Api\OrdenServicioController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\EquipoController;


Route::post('/login', [AuthController::class, 'login']);

Route::apiResource('clientes', ClienteController::class);
Route::apiResource('equipos', EquipoController::class);
Route::apiResource('ordenes-servicio', OrdenServicioController::class);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

});
