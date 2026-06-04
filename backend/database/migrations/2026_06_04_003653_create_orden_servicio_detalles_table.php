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
       Schema::create('orden_servicio_detalles', function (Blueprint $table) {

            $table->id();

            $table->foreignId('orden_servicio_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('descripcion');

            $table->decimal(
                'precio',
                10,
                2
            )->default(0);

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_servicio_detalles');
    }
};
