<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SoloAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()?->rol !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para realizar esta acción.'
            ], 403);
        }

        return $next($request);
    }
}