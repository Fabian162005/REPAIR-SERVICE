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
    Schema::create('venta_repuestos', function (Blueprint $table) {
        $table->id();

        $table->string('codigo')->unique(); // VTA-000001

        $table->foreignId('usuario_id')->constrained('users')->restrictOnDelete();
        $table->foreignId('cliente_id')->nullable()->constrained('clientes')->nullOnDelete();

        $table->enum('tipo_rubro', ['TECNOLOGIA', 'VEHICULAR']);

        $table->decimal('total', 10, 2)->default(0);

        $table->enum('metodo_pago', ['EFECTIVO', 'YAPE', 'PLIN', 'TARJETA', 'TRANSFERENCIA', 'OTROS']);

        $table->enum('estado', ['COMPLETADA', 'ANULADA'])->default('COMPLETADA');

        $table->text('observaciones')->nullable();

        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('venta_repuestos');
}
};
