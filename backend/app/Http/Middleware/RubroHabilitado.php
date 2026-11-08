<?php

namespace App\Http\Middleware;

use App\Services\PlanService;
use Closure;
use Illuminate\Http\Request;

class RubroHabilitado
{
    public function __construct(private PlanService $plan) {}

    public function handle(Request $request, Closure $next)
    {
        $rubro = $request->input('tipo_rubro');

        if ($rubro && !$this->plan->rubroPermitido($rubro)) {
            return response()->json([
                'success' => false,
                'message' => "Tu plan no incluye el rubro {$rubro}.",
            ], 403);
        }

        return $next($request);
    }
}