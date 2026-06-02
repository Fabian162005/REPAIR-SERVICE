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
    Schema::create('orden_servicios', function (Blueprint $table) {

        $table->id();

        $table->string('codigo_orden')->unique();

        $table->foreignId('cliente_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->foreignId('usuario_id')
            ->nullable()
            ->constrained('users')
            ->nullOnDelete();

        $table->foreignId('tecnico_id')
            ->nullable()
            ->constrained('users')
            ->nullOnDelete();

        $table->enum('tipo_rubro', [
            'TECNOLOGIA',
            'VEHICULAR'
        ])->default('TECNOLOGIA');

        $table->foreignId('equipo_id')
            ->nullable()
            ->constrained()
            ->nullOnDelete();

        $table->unsignedBigInteger('vehiculo_id')
            ->nullable();

        $table->enum('tipo_recepcion', [
            'RECEPCION',
            'DIAGNOSTICO_CONFIRMADO'
        ])->default('RECEPCION');

        $table->text('falla_reportada');

        $table->text('diagnostico_preliminar')
            ->nullable();

        $table->text('diagnostico_final')
            ->nullable();

        $table->enum('estado_actual', [

            'RECEPCIONADO',
            'DIAGNOSTICO',
            'ESPERANDO_APROBACION',
            'EN_REPARACION',
            'REPARADO',
            'ENTREGADO',
            'CANCELADO'

        ])->default('RECEPCIONADO');

        $table->enum('prioridad', [
            'BAJA',
            'MEDIA',
            'ALTA',
            'URGENTE'
        ])->default('MEDIA');

        $table->text('accesorios')->nullable();

        $table->string('contrasena')->nullable();

        $table->dateTime('fecha_ingreso');

        $table->dateTime('fecha_entrega_estimada')
            ->nullable();

        $table->dateTime('fecha_entrega_real')
            ->nullable();

        $table->integer('garantia_dias')
            ->default(0);

        $table->text('observaciones_cliente')
            ->nullable();

        $table->text('observaciones_tecnico')
            ->nullable();

        $table->text('recomendaciones')
            ->nullable();

        $table->decimal('total', 10, 2)
            ->default(0);

        $table->decimal('adelanto', 10, 2)
            ->default(0);

        $table->decimal('saldo_pendiente', 10, 2)
            ->default(0);

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_servicios');
    }
};
