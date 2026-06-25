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
                Schema::create('movimientos_caja', function (Blueprint $table) {

            $table->id();

            $table->enum('tipo_movimiento', [

                'INGRESO',
                'EGRESO'

            ]);

            $table->enum('origen', [

                'PAGO_ORDEN',
                'GASTO_MANUAL',
                'AJUSTE'

            ]);

            $table->enum('tipo_rubro', [

                'TECNOLOGIA',
                'VEHICULAR'

            ])->nullable();

            $table->foreignId('orden_servicio_id')
                ->nullable()
                ->constrained('orden_servicios')
                ->nullOnDelete();

            $table->foreignId('usuario_id')
                ->constrained('users');

            $table->decimal('monto', 10, 2);

            $table->string('descripcion');

            $table->text('observacion')
                ->nullable();

            $table->timestamp('fecha_movimiento');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimientos_caja');
    }
};
