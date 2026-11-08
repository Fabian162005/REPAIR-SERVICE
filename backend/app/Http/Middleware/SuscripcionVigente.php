<?php

namespace App\Http\Middleware;

use App\Services\PlanService;
use Closure;
use Illuminate\Http\Request;

class SuscripcionVigente
{
    public function __construct(private PlanService $plan) {}

    public function handle(Request $request, Closure $next)
    {
        if ($this->plan->vencida()) {

            $request->user()?->tokens()->delete();

            return response()->json([
                'message' => 'Tu suscripción venció el ' . $this->plan->venceEl()->format('d/m/Y')
                    . '. Contacta al proveedor para renovar.',
                'suscripcion_vencida' => true,
            ], 401);
        }

        return $next($request);
    }
}