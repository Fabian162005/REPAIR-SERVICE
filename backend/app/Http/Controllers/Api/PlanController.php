<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PlanService;

class PlanController extends Controller
{
    public function show(PlanService $plan)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'plan'           => $plan->plan(),
                'rubros'         => $plan->rubros(),
                'vence_el'       => $plan->venceEl()?->toDateString(),
                'dias_restantes' => $plan->diasRestantes(),
                'vencida'        => $plan->vencida(),
                'limites'        => $plan->limites(),
                'uso'            => $plan->uso(),
            ],
        ]);
    }
}