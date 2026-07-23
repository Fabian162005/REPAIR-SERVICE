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
    Schema::create('productos', function (Blueprint $table) {
        $table->id();

        $table->string('codigo', 20)->unique();

        $table->string('nombre');

        $table->text('descripcion')->nullable();

        $table->foreignId('categoria_id')
            ->constrained('categoria_productos')
            ->cascadeOnUpdate()
            ->restrictOnDelete();

        $table->decimal('precio_compra', 10, 2)->default(0);

        $table->decimal('precio_venta', 10, 2);

        $table->integer('stock_actual')->default(0);

        $table->integer('stock_minimo')->default(0);

        $table->string('unidad_medida', 30)->default('Unidad');

        $table->string('codigo_barras')->nullable();

        $table->boolean('activo')->default(true);

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
        public function down()
        {
            Schema::dropIfExists('productos');
        }
};
