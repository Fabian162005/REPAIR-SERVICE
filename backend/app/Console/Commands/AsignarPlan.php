<?php

namespace App\Console\Commands;

use App\Models\Configuracion;
use App\Services\PlanService;
use Illuminate\Console\Command;

class AsignarPlan extends Command
{
    protected $signature = 'plan:asignar {plan : BRONCE|PLATA|ORO|PLATINO} {rubros : TECNOLOGIA|VEHICULAR|AMBOS} {--vence= : Fecha de vencimiento YYYY-MM-DD}';

    protected $description = 'Asigna plan, rubros y vencimiento de la instalación';

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

        Configuracion::guardar('plan', $plan);
        Configuracion::guardar('rubros', $rubros);
        Configuracion::guardar('vence_el', $vence ?: '');

        $this->info("Plan {$plan} | Rubros {$rubros} | Vence: " . ($vence ?: 'sin vencimiento'));

        return self::SUCCESS;
    }
}