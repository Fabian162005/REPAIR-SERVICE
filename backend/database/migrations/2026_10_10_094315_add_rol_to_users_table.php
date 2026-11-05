<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('rol', ['ADMIN', 'TRABAJADOR'])
                  ->default('TRABAJADOR')
                  ->after('password');
        });

        // Tu usuario actual (id 1) pasa a ser admin
        DB::table('users')->where('id', 1)->update(['rol' => 'ADMIN']);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('rol');
        });
    }
};