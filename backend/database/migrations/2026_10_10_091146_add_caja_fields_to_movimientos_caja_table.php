<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Agregar VENTA_REPUESTO al enum "origen"
        DB::statement("
            ALTER TABLE movimientos_caja
            MODIFY origen ENUM('PAGO_ORDEN','VENTA_REPUESTO','GASTO_MANUAL','AJUSTE') NOT NULL
        ");

        // 2. Columnas nuevas
        Schema::table('movimientos_caja', function (Blueprint $table) {

            // nullable porque ya puedes tener movimientos viejos sin caja
            $table->foreignId('caja_id')
                ->nullable()
                ->after('id')
                ->constrained('cajas')
                ->restrictOnDelete();

            $table->enum('metodo_pago', [
                'EFECTIVO', 'YAPE', 'PLIN', 'TARJETA', 'TRANSFERENCIA', 'OTROS'
            ])->default('EFECTIVO')->after('monto');

            $table->foreignId('orden_pago_id')
                ->nullable()
                ->constrained('orden_pagos')
                ->nullOnDelete();

            $table->foreignId('venta_repuesto_id')
                ->nullable()
                ->constrained('venta_repuestos')
                ->nullOnDelete();

            // Se anula, no se borra
            $table->boolean('anulado')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('movimientos_caja', function (Blueprint $table) {
            $table->dropConstrainedForeignId('caja_id');
            $table->dropConstrainedForeignId('orden_pago_id');
            $table->dropConstrainedForeignId('venta_repuesto_id');
            $table->dropColumn(['metodo_pago', 'anulado']);
        });

        DB::statement("
            ALTER TABLE movimientos_caja
            MODIFY origen ENUM('PAGO_ORDEN','GASTO_MANUAL','AJUSTE') NOT NULL
        ");
    }
};