<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use App\Services\PlanService;

class PlanController extends Controller
{
    public function show(PlanService $plan)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'plan'     => $plan->plan(),
                'rubros'   => $plan->rubros(),
                'vence_el' => Configuracion::obtener('vence_el') ?: null,
                'limites'  => $plan->limites(),
                'uso'      => $plan->uso(),
            ],
        ]);
    }
}