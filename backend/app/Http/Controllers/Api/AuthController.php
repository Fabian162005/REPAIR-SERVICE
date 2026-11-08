<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Bloquea cuentas desactivadas (antes de crear el token)
        if (!$user->activo) {
            return response()->json([
                'message' => 'Tu cuenta está desactivada. Contacta al administrador.'
            ], 403);
        }

            $plan = app(\App\Services\PlanService::class);

            if ($plan->vencida()) {
                return response()->json([
                    'message' => 'Tu suscripción venció el ' . $plan->venceEl()->format('d/m/Y')
                        . '. Contacta al proveedor para renovar.',
                    'suscripcion_vencida' => true,
                ], 403);
            }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Sesión cerrada'
        ]);
    }
}