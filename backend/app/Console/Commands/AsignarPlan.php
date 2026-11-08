<?php

namespace App\Console\Commands;

use App\Models\Auditoria;
use App\Models\Caja;
use App\Models\Configuracion;
use App\Models\User;
use App\Services\PlanService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AsignarPlan extends Command
{
    protected $signature = 'plan:asignar
        {plan : BRONCE|PLATA|ORO|PLATINO}
        {rubros : TECNOLOGIA|VEHICULAR|AMBOS}
        {--vence= : Fecha de vencimiento YYYY-MM-DD}
        {--conservar= : IDs de usuarios que siguen activos si hay exceso, separados por coma}';

    protected $description = 'Asigna plan, rubros y vencimiento. Si hay exceso de usuarios, pide cuáles conservar';

    public function handle(): int
    {
        $plan   = strtoupper($this->argument('plan'));
        $rubros = strtoupper($this->argument('rubros'));
        $vence  = $this->option('vence');

        if (!isset(PlanService::PLANES[$plan])) {
            $this->error('Plan inválido. Usa: ' . implode(', ', array_keys(PlanService::PLANES)));
            return self::FAILURE;
        }

        if (!in_array($rubros, ['TECNOLOGIA', 'VEHICULAR', 'AMBOS'])) {
            $this->error('Rubros inválidos. Usa: TECNOLOGIA, VEHICULAR o AMBOS.');
            return self::FAILURE;
        }

        if ($rubros === 'AMBOS' && $plan !== 'PLATINO') {
            $this->error('Solo el plan PLATINO permite ambos rubros.');
            return self::FAILURE;
        }

        if ($vence && !strtotime($vence)) {
            $this->error('Fecha inválida. Usa el formato YYYY-MM-DD.');
            return self::FAILURE;
        }

        $limites  = PlanService::PLANES[$plan];
        $activos  = User::where('activo', true)->orderBy('id')->get();
        $conservar = $this->option('conservar')
            ? array_map('intval', explode(',', $this->option('conservar')))
            : null;

        $aDesactivar = collect();

        foreach (['ADMIN' => 'admins', 'TRABAJADOR' => 'trabajadores'] as $rol => $clave) {

            $lista = $activos->where('rol', $rol);
            $max   = $limites[$clave];

            if ($lista->count() <= $max) {
                continue;
            }

            $this->warn(sprintf(
                'El plan %s permite %d %s y hay %d activos.',
                $plan, $max, $rol === 'ADMIN' ? 'administrador(es)' : 'trabajador(es)', $lista->count()
            ));

            $ids = $conservar !== null
                ? $lista->pluck('id')->intersect($conservar)->values()->all()
                : $this->elegir($lista, $rol, $max);

            if ($ids === null) {
                return self::FAILURE;
            }

            if (count($ids) > $max) {
                $this->error("Elegiste más de {$max}. Reduce la lista.");
                return self::FAILURE;
            }

            if ($rol === 'ADMIN' && count($ids) < 1) {
                $this->error('Debe quedar al menos un administrador activo.');
                return self::FAILURE;
            }

            $aDesactivar = $aDesactivar->merge($lista->whereNotIn('id', $ids));
        }

        // No se desactiva a nadie con la caja abierta
        if ($aDesactivar->isNotEmpty()) {

            $conCaja = $aDesactivar->filter(
                fn ($u) => Caja::where('usuario_id', $u->id)->abiertas()->exists()
            );

            if ($conCaja->isNotEmpty()) {
                $this->error('Estos usuarios tienen la caja abierta. Ciérrala antes de cambiar el plan:');
                foreach ($conCaja as $u) {
                    $this->line("  - {$u->name} ({$u->email})");
                }
                return self::FAILURE;
            }

            $this->line('Se desactivarán (el historial se conserva):');
            foreach ($aDesactivar as $u) {
                $this->line("  - {$u->name} ({$u->email}) [{$u->rol}]");
            }

            if ($this->input->isInteractive() && !$this->confirm('¿Continuar?')) {
                $this->info('Cancelado. No se cambió nada.');
                return self::FAILURE;
            }
        }

        DB::transaction(function () use ($aDesactivar, $plan, $rubros, $vence) {

            foreach ($aDesactivar as $u) {
                $u->update(['activo' => false]);
                $u->tokens()->delete();

                Auditoria::registrar('DESACTIVAR_POR_PLAN', 'usuario', $u->id, ['plan' => $plan]);
            }

            Configuracion::guardar('plan', $plan);
            Configuracion::guardar('rubros', $rubros);
            Configuracion::guardar('vence_el', $vence ?: '');
        });

        $this->info("Plan {$plan} | Rubros {$rubros} | Vence: " . ($vence ?: 'sin vencimiento'));

        if ($aDesactivar->isNotEmpty()) {
            $this->info($aDesactivar->count() . ' usuario(s) desactivado(s).');
        }

        return self::SUCCESS;
    }

    /** Pregunta cuáles conservar. Devuelve ids o null si no se puede preguntar. */
    private function elegir($lista, string $rol, int $max): ?array
    {
        if (!$this->input->isInteractive()) {
            $this->error('Hay exceso de usuarios. Usa --conservar=ID1,ID2 o ejecuta el comando en modo interactivo.');
            return null;
        }

        $etiquetas = $lista->mapWithKeys(
            fn ($u) => [$u->id => "ID {$u->id} - {$u->name} ({$u->email})"]
        )->all();

        $elegidos = $this->choice(
            "¿Cuáles {$rol} siguen activos? (máx. {$max}; separa con comas)",
            array_values($etiquetas),
            null,
            null,
            true
        );

        return array_keys(array_intersect($etiquetas, $elegidos));
    }
}