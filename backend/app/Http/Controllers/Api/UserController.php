<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auditoria;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $usuarios = User::select('id', 'name', 'email', 'rol', 'activo', 'created_at')
            ->when($request->boolean('activos'), fn ($q) => $q->where('activo', true))
            ->orderBy('name')
            ->get();

        return response()->json(['success' => true, 'data' => $usuarios]);
    }

    public function store(Request $request)
    {
        $d = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'rol'      => 'required|in:ADMIN,TRABAJADOR',
        ]);

        // El cast 'hashed' del modelo encripta la contraseña
        $user = User::create([
            'name'     => $d['name'],
            'email'    => $d['email'],
            'password' => $d['password'],
            'rol'      => $d['rol'],
            'activo'   => true,
        ]);

        Auditoria::registrar('CREAR_USUARIO', 'usuario', $user->id, [
            'email' => $user->email,
            'rol'   => $user->rol,
        ]);

        return response()->json(['success' => true, 'message' => 'Usuario creado.', 'data' => $user], 201);
    }

    public function update(Request $request, User $user)
    {
        $d = $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'rol'    => 'required|in:ADMIN,TRABAJADOR',
            'activo' => 'required|boolean',
        ]);

        $pierdeAdmin = $user->rol === 'ADMIN' && ($d['rol'] !== 'ADMIN' || !$d['activo']);

        if ($pierdeAdmin) {
            if ($user->id === $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes quitarte el rol de administrador ni desactivarte a ti mismo.'
                ], 422);
            }

            if ($user->activo && $this->esUltimoAdmin($user)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Debe existir al menos un administrador activo.'
                ], 422);
            }
        }

        $user->update($d);

        // Al desactivar, se cierran sus sesiones
        if (!$d['activo']) {
            $user->tokens()->delete();
        }

        Auditoria::registrar('EDITAR_USUARIO', 'usuario', $user->id, [
            'rol'    => $user->rol,
            'activo' => $user->activo,
        ]);

        return response()->json(['success' => true, 'message' => 'Usuario actualizado.', 'data' => $user->fresh()]);
    }

    public function resetPassword(Request $request, User $user)
    {
        $d = $request->validate(['password' => 'required|string|min:8']);

        $user->update(['password' => $d['password']]);
        $user->tokens()->delete(); // obliga a iniciar sesión de nuevo

        Auditoria::registrar('RESET_PASSWORD', 'usuario', $user->id);

        return response()->json(['success' => true, 'message' => 'Contraseña restablecida.']);
    }

    private function esUltimoAdmin(User $user): bool
    {
        return !User::where('rol', 'ADMIN')
            ->where('activo', true)
            ->where('id', '!=', $user->id)
            ->exists();
    }
}