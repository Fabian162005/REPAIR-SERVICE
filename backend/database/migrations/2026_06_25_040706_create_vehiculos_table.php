<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehiculos', function (Blueprint $table) {

            $table->id();

            $table->foreignId('cliente_id')
                ->constrained('clientes')
                ->cascadeOnDelete();

            $table->enum('tipo_vehiculo', [

                'CARRO',
                'MOTO_LINEAL',
                'MOTOTAXI'

            ]);

            $table->string('placa')->unique();

            $table->string('marca');

            $table->string('modelo');

            $table->year('anio')
                ->nullable();

            $table->string('numero_motor')
                ->nullable();

            $table->string('numero_chasis')
                ->nullable();

            $table->enum('combustible', [

                'GASOLINA',
                'DIESEL',
                'GLP',
                'GNV',
                'HIBRIDO',
                'ELECTRICO'

            ])->nullable();

            $table->string('cilindrada')
                ->nullable();

            $table->string('color')
                ->nullable();

            $table->integer('kilometraje')
                ->nullable();

            $table->text('observaciones')
                ->nullable();

            $table->boolean('activo')
                ->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehiculos');
    }
};