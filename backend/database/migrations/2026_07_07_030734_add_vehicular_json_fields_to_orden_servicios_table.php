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
    Schema::table('orden_servicios', function (Blueprint $table) {

        $table->json('recepcion_vehicular')
            ->nullable()
            ->after('vehiculo_id');

        $table->json('diagnostico_vehicular')
            ->nullable()
            ->after('recepcion_vehicular');

        $table->json('checklist_vehicular')
            ->nullable()
            ->after('diagnostico_vehicular');

        $table->json('servicios_vehiculares')
            ->nullable()
            ->after('checklist_vehicular');

        $table->json('proximo_mantenimiento')
            ->nullable()
            ->after('servicios_vehiculares');

    });
}

    /**
     * Reverse the migrations.
     */
        public function down(): void
    {
        Schema::table('orden_servicios', function (Blueprint $table) {

            $table->dropColumn([
                'recepcion_vehicular',
                'diagnostico_vehicular',
                'checklist_vehicular',
                'servicios_vehiculares',
                'proximo_mantenimiento'
            ]);

        });
    }
};
