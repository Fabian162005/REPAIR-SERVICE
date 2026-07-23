<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('inventario_movimientos', function (Blueprint $table) {
        $table->id();

        $table->foreignId('producto_id')
            ->constrained('productos')
            ->cascadeOnUpdate()
            ->restrictOnDelete();

        $table->enum('tipo_movimiento', [
            'ENTRADA',
            'SALIDA',
            'AJUSTE',
            'DEVOLUCION',
            'TRANSFERENCIA'
        ]);

        $table->integer('cantidad');

        $table->integer('stock_anterior');

        $table->integer('stock_nuevo');

        $table->string('motivo')->nullable();

        $table->string('referencia_tipo')->nullable();
        // ORDEN
        // COMPRA
        // AJUSTE
        // STOCK_INICIAL

        $table->unsignedBigInteger('referencia_id')->nullable();

        $table->foreignId('usuario_id')
            ->nullable()
            ->constrained('users')
            ->nullOnDelete()
            ->cascadeOnUpdate();

        $table->text('observaciones')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down()
{
    Schema::dropIfExists('inventario_movimientos');
}
};
