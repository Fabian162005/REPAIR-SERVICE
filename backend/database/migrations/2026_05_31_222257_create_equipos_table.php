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
    Schema::create('equipos', function (Blueprint $table) {

        $table->id();

        $table->foreignId('cliente_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->enum('tipo_equipo', [
            'CELULAR',
            'TABLET',
            'LAPTOP',
            'PC'
        ]);

        $table->string('marca');
        $table->string('modelo');

        $table->string('imei')->nullable();
        $table->string('numero_serie')->nullable();

        $table->string('procesador')->nullable();
        $table->string('ram')->nullable();
        $table->string('almacenamiento')->nullable();
        $table->string('tarjeta_video')->nullable();

        $table->text('observaciones')->nullable();

        $table->boolean('activo')
            ->default(true);

        $table->timestamps();
    });
}
};
