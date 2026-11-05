<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrdenPago;
use App\Models\OrdenServicio;
use App\Services\CajaService;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Auditoria;
use App\Services\PermisoService;

class OrdenPagoController extends Controller
{
    
public function __construct(
    private CajaService $cajaService,
    private PermisoService $permiso
) {}

    public function index($ordenId)
    {
        $pagos = OrdenPago::with('usuario')
            ->where('orden_servicio_id', $ordenId)
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $pagos]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'orden_servicio_id' => 'required|exists:orden_servicios,id',
            'monto'       => 'required|numeric|min:0.01',
            'metodo_pago' => 'required|in:EFECTIVO,YAPE,PLIN,TRANSFERENCIA,TARJETA,OTROS',
            'observacion' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($request) {

                $orden = OrdenServicio::lockForUpdate()->findOrFail($request->orden_servicio_id);

                if ($orden->estado_pago === 'PAGADO') {
                    throw new DomainException('La orden ya está completamente pagada.');
                }

                $pago = OrdenPago::create([
                    'orden_servicio_id' => $orden->id,
                    'usuario_id'        => auth()->id(),
                    'monto'             => $request->monto,
                    'metodo_pago'       => $request->metodo_pago,
                    'observacion'       => $request->observacion,
                ]);

                // Ingreso automático a la caja de quien cobra
                $this->cajaService->ingresoPorPago($pago, $orden);

                $this->recalcular($orden);
            });

        } catch (DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }

        return response()->json(['success' => true, 'message' => 'Pago registrado correctamente']);
    }

   public function destroy(Request $request, $id)
{
    $pago = OrdenPago::findOrFail($id);

    try {
        $forzar = false;

        if ($request->filled('clave_permiso')) {
            $this->permiso->verificar($request->clave_permiso);
            $forzar = true;
        }

        DB::transaction(function () use ($pago, $forzar) {

            $orden = OrdenServicio::lockForUpdate()->findOrFail($pago->orden_servicio_id);

            $this->cajaService->anularPorPago($pago, $forzar);

            if ($forzar) {
                Auditoria::registrar('ELIMINAR_PAGO', 'pago', $pago->id, [
                    'orden_id' => $pago->orden_servicio_id,
                    'monto'    => (float) $pago->monto,
                    'metodo'   => $pago->metodo_pago,
                ]);
            }

            $pago->delete();

            $this->recalcular($orden);
        });

    } catch (DomainException $e) {
        return response()->json([
            'success'        => false,
            'message'        => $e->getMessage(),
            'requiere_clave' => $e->getCode() === PermisoService::REQUIERE_CLAVE,
        ], 422);
    }

    return response()->json(['success' => true, 'message' => 'Pago eliminado']);
}

    private function recalcular(OrdenServicio $orden): void
    {
        $totalPagado = (float) OrdenPago::where('orden_servicio_id', $orden->id)->sum('monto');
        $saldo = (float) $orden->total - $totalPagado;

        $orden->adelanto        = $totalPagado;
        $orden->saldo_pendiente = max($saldo, 0);
        $orden->estado_pago     = $saldo <= 0
            ? 'PAGADO'
            : ($totalPagado > 0 ? 'PAGO_PARCIAL' : 'PENDIENTE_PAGO');

        $orden->save();
    }
}