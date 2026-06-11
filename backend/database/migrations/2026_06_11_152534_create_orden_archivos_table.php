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
        Schema::create('orden_archivos', function (Blueprint $table) {

            $table->id();

            $table->foreignId('orden_servicio_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('nombre_original');

            $table->string('archivo');

            $table->string('tipo')->default('RECEPCION');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_archivos');
    }
};
