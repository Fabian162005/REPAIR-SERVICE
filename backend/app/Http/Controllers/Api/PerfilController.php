<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auditoria;
use App\Services\PermisoService;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PerfilController extends Controller
{
    public function show(Request $request)
    {
        return response()->json(['success' => true, 'data' => $this->datos($request->user())]);
    }

    public function update(Request $request, PermisoService $permiso)
    {
        $user = $request->user();

        $d = $request->validate([
            'name'          => 'required|string|max:255',
            'dni'           => 'nullable|string|max:20',
            'telefono'      => 'nullable|string|max:20',
            'direccion'     => 'nullable|string|max:255',
            'clave_permiso' => 'nullable|string',
        ]);

        // El trabajador necesita la clave del administrador; el admin no
        if ($user->rol !== 'ADMIN') {
            try {
                $permiso->verificar($d['clave_permiso'] ?? null);
            } catch (DomainException $e) {
                return response()->json([
                    'success'        => false,
                    'message'        => $e->getMessage(),
                    'requiere_clave' => $e->getCode() === PermisoService::REQUIERE_CLAVE,
                ], 422);
            }
        }

        $user->update([
            'name'      => $d['name'],
            'dni'       => $d['dni'] ?? null,
            'telefono'  => $d['telefono'] ?? null,
            'direccion' => $d['direccion'] ?? null,
        ]);

        Auditoria::registrar('EDITAR_PERFIL', 'usuario', $user->id);

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado.',
            'data'    => $this->datos($user->fresh()),
            'user'    => $user->fresh(), // sin DNI ni teléfono, para el navegador
        ]);
    }

    public function cambiarPassword(Request $request)
    {
        $user = $request->user();

        $d = $request->validate([
            'password_actual' => 'required|string',
            'password'        => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($d['password_actual'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'La contraseña actual es incorrecta.',
            ], 422);
        }

        $user->update(['password' => $d['password']]);

        // Cierra las demás sesiones, conserva la actual
        $actual = $user->currentAccessToken();
        $user->tokens()->when($actual?->id, fn ($q, $id) => $q->where('id', '!=', $id))->delete();

        Auditoria::registrar('CAMBIAR_PASSWORD', 'usuario', $user->id);

        return response()->json(['success' => true, 'message' => 'Contraseña actualizada.']);
    }

    private function datos($u): array
    {
        return [
            'name'      => $u->name,
            'email'     => $u->email,
            'rol'       => $u->rol,
            'dni'       => $u->dni,
            'telefono'  => $u->telefono,
            'direccion' => $u->direccion,
        ];
    }
}