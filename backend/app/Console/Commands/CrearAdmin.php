<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\PlanService;
use DomainException;
use Illuminate\Console\Command;

class CrearAdmin extends Command
{
    protected $signature = 'admin:crear {email} {name} {--password=}';

    protected $description = 'Crea un administrador (para el primer acceso de una instalación)';

    public function handle(PlanService $plan): int
    {
        $email = $this->argument('email');

        if (User::where('email', $email)->exists()) {
            $this->error('Ya existe un usuario con ese correo.');
            return self::FAILURE;
        }

        try {
            $plan->verificarCupo('ADMIN');
        } catch (DomainException $e) {
            $this->error($e->getMessage());
            return self::FAILURE;
        }

        $password = $this->option('password') ?: $this->secret('Contraseña (mínimo 8 caracteres)');

        if (strlen((string) $password) < 8) {
            $this->error('La contraseña debe tener al menos 8 caracteres.');
            return self::FAILURE;
        }

        User::create([
            'name'     => $this->argument('name'),
            'email'    => $email,
            'password' => $password,
            'rol'      => 'ADMIN',
            'activo'   => true,
        ]);

        $this->info("Administrador {$email} creado.");

        return self::SUCCESS;
    }
}