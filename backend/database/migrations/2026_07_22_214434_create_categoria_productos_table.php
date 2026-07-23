<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriaProductosTable extends Migration
{
    public function up()
    {
        Schema::create('categoria_productos', function (Blueprint $table) {

            $table->id();

            $table->string('nombre');

            $table->enum('tipo_rubro', [
                'TECNOLOGIA',
                'VEHICULAR'
            ]);

            $table->boolean('activo')->default(true);

            $table->timestamps();

        });
    }

    public function down()
    {
        Schema::dropIfExists('categoria_productos');
    }
}