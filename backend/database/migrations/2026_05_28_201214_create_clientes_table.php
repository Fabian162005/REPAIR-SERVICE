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
        Schema::create('clientes', function (Blueprint $table) {

            $table->id();

            /*
            |--------------------------------------------------------------------------
            | DATOS PERSONALES
            |--------------------------------------------------------------------------
            */

            $table->enum('tipo_documento', [
                'DNI',
                'RUC',
                'CE',
                'PASAPORTE'
            ])->default('DNI');

            $table->string('numero_documento', 20)->unique();

            $table->string('nombres');
            $table->string('apellidos')->nullable();

            $table->string('razon_social')->nullable();

            /*
            |--------------------------------------------------------------------------
            | CONTACTO
            |--------------------------------------------------------------------------
            */

            $table->string('celular', 20)->nullable();

            $table->string('correo')->nullable();

            $table->string('direccion')->nullable();

            $table->string('distrito')->nullable();

            $table->string('ciudad')->default('Piura');

            /*
            |--------------------------------------------------------------------------
            | EXTRA
            |--------------------------------------------------------------------------
            */

            $table->text('observaciones')->nullable();

            $table->boolean('activo')->default(true);

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};