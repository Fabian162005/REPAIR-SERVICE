<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Caja;
use App\Models\Configuracion;
use App\Models\MovimientoCaja;
use App\Services\CajaService;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Auditoria;
use App\Services\PermisoService;
class CajaController extends Controller
{
    
public function __construct(
    private CajaService $service,
    private PermisoService $permiso
) {}

    /** Caja del usuario: la abierta, o la de hoy si ya la cerró. */
    public function actual(Request $request)
    {
        $caja = Caja::where('usuario_id', $request->user()->id)
            ->where(fn ($q) => $q->abiertas()->orWhereDate('fecha', today()))
            ->latest('fecha')
            ->first();

        if (!$caja) {
            return response()->json(['success' => true, 'data' => null]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'caja'        => $caja->load('usuario'),
                'resumen'     => $this->service->resumen($caja),
                'movimientos' => $caja->movimientos()->with('ordenServicio')->latest('fecha_movimiento')->get(),
                'vencida'     => $caja->estado === 'ABIERTA' && $caja->fecha->lt(today()),
            ],
        ]);
    }

    public function abrir(Request $request)
    {
        $d = $request->validate([
            'monto_apertura' => 'required|numeric|min:0',
            'observaciones'  => 'nullable|string|max:500',
            'pin'            => 'nullable|string|max:20',
            'usuario_id'     => 'nullable|exists:users,id',
        ]);

        try {
            if ($request->user()->rol !== 'ADMIN') {
                $this->permiso->verificar($request->pin);
            }

            $destino = $request->user()->rol === 'ADMIN' && !empty($d['usuario_id'])
                ? (int) $d['usuario_id']
                : $request->user()->id;

            $caja = $this->service->abrir($destino, $d['monto_apertura'], $d['observaciones'] ?? null);

            return response()->json(['success' => true, 'message' => 'Caja abierta correctamente.', 'data' => $caja], 201);

        } catch (DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function cerrar(Request $request)
    {
        $d = $request->validate([
            'efectivo_contado' => 'required|numeric|min:0',
            'observaciones'    => 'nullable|string|max:500',
            'pin'              => 'nullable|string|max:20',
            'usuario_id'       => 'nullable|exists:users,id',
        ]);

        try {
            if ($request->user()->rol !== 'ADMIN') {
                $this->permiso->verificar($request->pin);
            }

            $destino = $request->user()->rol === 'ADMIN' && !empty($d['usuario_id'])
                ? (int) $d['usuario_id']
                : $request->user()->id;

            // Incluye cajas vencidas: permite cerrar la de un día anterior
            $caja = Caja::where('usuario_id', $destino)->abiertas()->latest('fecha')->first();

            if (!$caja) {
                throw new DomainException('No hay una caja abierta para cerrar.');
            }

            $caja = $this->service->cerrar($caja, $d['efectivo_contado'], $d['observaciones'] ?? null);

            return response()->json(['success' => true, 'message' => 'Caja cerrada correctamente.', 'data' => $caja]);

        } catch (DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

public function egreso(Request $request)
{
    $d = $request->validate([
        'monto'       => 'required|numeric|min:0.01',
        'metodo_pago' => 'required|in:EFECTIVO,YAPE,PLIN,TARJETA,TRANSFERENCIA,OTROS',
        'descripcion' => 'required|string|max:255',
        'observacion' => 'nullable|string|max:500',
        'tipo_rubro'  => 'nullable|in:TECNOLOGIA,VEHICULAR',
    ]);

    try {
        $mov = $this->service->egreso(
            $request->user()->id,
            $d['monto'],
            $d['metodo_pago'],
            $d['descripcion'],
            $d['observacion'] ?? null,
            $d['tipo_rubro'] ?? null
        );

        return response()->json(['success' => true, 'message' => 'Egreso registrado.', 'data' => $mov], 201);

    } catch (DomainException $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
    }
}

    /** Solo admin (por ruta): anula egresos manuales. Los cobros se anulan desde su pago o venta. */
    public function anularMovimiento(Request $request, $id)
    {
        $mov = MovimientoCaja::with('caja')->findOrFail($id);

        if ($mov->origen !== 'GASTO_MANUAL') {
            return response()->json(['success' => false, 'message' => 'Solo se pueden anular egresos manuales desde aquí.'], 403);
        }

        try {
            $this->service->anularMovimiento($mov);

            return response()->json(['success' => true, 'message' => 'Egreso anulado.']);

        } catch (DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /** Solo admin: caja general del día. */
    public function general(Request $request)
    {
        $fecha = $request->validate(['fecha' => 'nullable|date'])['fecha'] ?? today()->toDateString();

        return response()->json(['success' => true, 'data' => $this->service->cajaGeneral($fecha)]);
    }

    public function historial(Request $request)
    {
        $cajas = Caja::with('usuario')
            ->where('usuario_id', $request->user()->id)
            ->latest('fecha')
            ->limit(30)
            ->get();

        return response()->json(['success' => true, 'data' => $cajas]);
    }

    /** Solo admin: cambiar el PIN (pide su contraseña). */
    public function cambiarPin(Request $request)
    {
        $d = $request->validate([
            'pin_nuevo' => 'required|string|min:4|max:20',
            'password'  => 'required|string',
        ]);

        if (!Hash::check($d['password'], $request->user()->password)) {
            return response()->json(['success' => false, 'message' => 'Tu contraseña es incorrecta.'], 422);
        }

        Configuracion::guardar('caja_pin', Hash::make($d['pin_nuevo']));

        return response()->json(['success' => true, 'message' => 'PIN de caja actualizado.']);
    }

    /** Solo admin: indica si hay PIN configurado (nunca lo devuelve). */
    public function estadoPin()
    {
        return response()->json([
            'success' => true,
            'data' => ['configurado' => Configuracion::obtener('caja_pin') !== null],
        ]);
    }

    public function reabrir(Request $request, Caja $caja)
{
    $d = $request->validate([
        'clave_permiso' => 'required|string',
        'motivo'        => 'required|string|min:5|max:255',
    ]);

    try {
        $this->permiso->verificar($d['clave_permiso']);

        $caja = $this->service->reabrir($caja);

        Auditoria::registrar('REABRIR_CAJA', 'caja', $caja->id, ['motivo' => $d['motivo']]);

        return response()->json(['success' => true, 'message' => 'Caja reabierta.', 'data' => $caja]);

    } catch (DomainException $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
    }
}

public function ajustar(Request $request, Caja $caja)
{
    $d = $request->validate([
        'efectivo_contado' => 'required|numeric|min:0',
        'clave_permiso'    => 'required|string',
        'motivo'           => 'required|string|min:5|max:255',
    ]);

    try {
        $this->permiso->verificar($d['clave_permiso']);

        $antes = (float) $caja->efectivo_contado;

        $caja = $this->service->ajustarContado($caja, (float) $d['efectivo_contado']);

        Auditoria::registrar('AJUSTAR_CAJA', 'caja', $caja->id, [
            'contado_anterior' => $antes,
            'contado_nuevo'    => (float) $d['efectivo_contado'],
            'motivo'           => $d['motivo'],
        ]);

        return response()->json(['success' => true, 'message' => 'Conteo ajustado.', 'data' => $caja]);

    } catch (DomainException $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
    }
}


}