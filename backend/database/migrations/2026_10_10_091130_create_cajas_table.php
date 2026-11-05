<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('cajas', function (Blueprint $table) {
        $table->id();

        $table->foreignId('usuario_id')->constrained('users')->restrictOnDelete();

        $table->date('fecha');

        $table->decimal('monto_apertura', 10, 2)->default(0);

        // Se llenan al cerrar
        $table->decimal('efectivo_esperado', 10, 2)->nullable();
        $table->decimal('efectivo_contado', 10, 2)->nullable();
        $table->decimal('diferencia', 10, 2)->nullable(); // contado - esperado

        $table->enum('estado', ['ABIERTA', 'CERRADA'])->default('ABIERTA');

        $table->timestamp('abierta_at')->nullable();
        $table->timestamp('cerrada_at')->nullable();

        $table->text('observaciones')->nullable();

        $table->timestamps();

        $table->unique(['usuario_id', 'fecha']);
    });
}

public function down(): void
{
    Schema::dropIfExists('cajas');
}
};
