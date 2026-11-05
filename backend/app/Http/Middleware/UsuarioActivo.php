<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class UsuarioActivo
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && !$user->activo) {
            $user->tokens()->delete();

            return response()->json([
                'message' => 'Tu cuenta está desactivada. Contacta al administrador.'
            ], 401);
        }

        return $next($request);
    }
}