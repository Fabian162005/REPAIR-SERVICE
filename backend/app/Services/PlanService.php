<?php

namespace App\Services;

use App\Models\Configuracion;
use App\Models\User;
use DomainException;
use Carbon\Carbon;
class PlanService
{
    public const PLANES = [
        'BRONCE'  => ['admins' => 1, 'trabajadores' => 1],
        'PLATA'   => ['admins' => 1, 'trabajadores' => 2],
        'ORO'     => ['admins' => 2, 'trabajadores' => 4],
        'PLATINO' => ['admins' => 4, 'trabajadores' => 8],
    ];

    public function plan(): string
    {
        $p = strtoupper((string) Configuracion::obtener('plan', 'BRONCE'));

        return isset(self::PLANES[$p]) ? $p : 'BRONCE';
    }

    /** TECNOLOGIA | VEHICULAR | AMBOS */
    public function rubros(): string
    {
        $r = strtoupper((string) Configuracion::obtener('rubros', 'AMBOS'));

        return in_array($r, ['TECNOLOGIA', 'VEHICULAR', 'AMBOS']) ? $r : 'AMBOS';
    }

    public function limites(): array
    {
        return self::PLANES[$this->plan()];
    }

    public function uso(): array
    {
        $c = User::where('activo', true)
            ->selectRaw('rol, count(*) as total')
            ->groupBy('rol')
            ->pluck('total', 'rol');

        return [
            'admins'       => (int) ($c['ADMIN'] ?? 0),
            'trabajadores' => (int) ($c['TRABAJADOR'] ?? 0),
        ];
    }

    /** Lanza excepción si no hay cupo para otro usuario activo con ese rol. */
    public function verificarCupo(string $rol, ?int $ignorarId = null): void
    {
        $clave = $rol === 'ADMIN' ? 'admins' : 'trabajadores';

        $usados = User::where('activo', true)
            ->where('rol', $rol)
            ->when($ignorarId, fn ($q) => $q->where('id', '!=', $ignorarId))
            ->count();

        $max = $this->limites()[$clave];

        if ($usados >= $max) {
            throw new DomainException(sprintf(
                'Tu plan %s permite %d %s activo(s). Desactiva uno o mejora tu plan.',
                $this->plan(),
                $max,
                $rol === 'ADMIN' ? 'administrador(es)' : 'trabajador(es)'
            ));
        }
    }

        public function venceEl(): ?Carbon
    {
        $v = Configuracion::obtener('vence_el');

        return $v ? Carbon::parse($v)->startOfDay() : null;
    }

    /** La fecha de vencimiento es el último día válido (inclusive). */
    public function vencida(): bool
    {
        $v = $this->venceEl();

        return $v !== null && today()->greaterThan($v);
    }

    public function diasRestantes(): ?int
    {
        $v = $this->venceEl();

        return $v ? (int) today()->diffInDays($v, false) : null;
    }

    public function rubroPermitido(string $rubro): bool
    {
        $r = $this->rubros();

        return $r === 'AMBOS' || $r === strtoupper($rubro);
    }
}

