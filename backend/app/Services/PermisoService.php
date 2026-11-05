<?php

namespace App\Services;

use App\Models\Configuracion;
use DomainException;
use Illuminate\Support\Facades\Hash;

class PermisoService
{
    public const REQUIERE_CLAVE = 1001;

    public function verificar(?string $clave): void
    {
        $hash = Configuracion::obtener('caja_pin');

        if (!$hash) {
            throw new DomainException('El administrador aún no configuró la clave de permiso.');
        }

        if (!$clave) {
            throw new DomainException('Se requiere la clave de permiso.', self::REQUIERE_CLAVE);
        }

        if (!Hash::check($clave, $hash)) {
            throw new DomainException('Clave de permiso incorrecta.');
        }
    }
}