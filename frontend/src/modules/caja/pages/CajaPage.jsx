import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import useAuthStore from "../../../store/authStore";
import cajaService from "../Services/CajaService";
import obtenerMensajeError from "../../../utils/obtenerMensajeError";

import CajaResumen from "../components/CajaResumen";
import MovimientosCajaTable from "../components/MovimientosCajaTable";
import CajaGeneral from "../components/CajaGeneral";

import { reabrirCaja, ajustarCaja } from "../cajaAcciones";

const METODOS = ["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA", "OTROS"];

const soles = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

export default function CajaPage() {

    const user = useAuthStore((s) => s.user);
    const esAdmin = user?.rol === "ADMIN";

    const [data, setData] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [vista, setVista] = useState("mia");

    const cargar = async () => {
        try {
            setCargando(true);
            setData(await cajaService.actual());
        } catch (error) {
            Swal.fire("Error", obtenerMensajeError(error, "No se pudo cargar la caja."), "error");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const campoPin = esAdmin ? "" : `
        <input id="swal-pin" type="password" class="swal2-input" placeholder="Clave de Permiso (lo da el administrador)">
    `;

    // ---------- ABRIR ----------
    const abrirCaja = async () => {

        const r = await Swal.fire({
            title: "Abrir caja",
            html: `
                <input id="swal-monto" type="number" step="0.01" min="0" class="swal2-input" placeholder="Monto de apertura (S/)">
                ${campoPin}
            `,
            showCancelButton: true,
            confirmButtonText: "Abrir",
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            preConfirm: () => {
                const monto = document.getElementById("swal-monto").value;
                const pin = document.getElementById("swal-pin")?.value;

                if (monto === "" || Number(monto) < 0) {
                    Swal.showValidationMessage("Ingresa el monto de apertura");
                    return false;
                }
                if (!esAdmin && !pin) {
                    Swal.showValidationMessage("Ingresa la Clave de Permiso");
                    return false;
                }
                return { monto_apertura: Number(monto), pin };
            }
        });

        if (!r.isConfirmed) return;

        try {
            const res = await cajaService.abrir(r.value);
            await Swal.fire("Listo", res.message, "success");
            cargar();
        } catch (error) {
            Swal.fire("No se pudo abrir", obtenerMensajeError(error), "error");
        }
    };

    // ---------- CERRAR ----------
    const cerrarCaja = async () => {

        const r = await Swal.fire({
            title: "Cerrar caja",
            html: `
                <p class="mb-2">Cuenta el efectivo que tienes en la caja e ingrésalo.</p>
                <input id="swal-contado" type="number" step="0.01" min="0" class="swal2-input" placeholder="Efectivo contado (S/)">
                <input id="swal-obs" class="swal2-input" placeholder="Observaciones (opcional)">
                ${campoPin}
            `,
            showCancelButton: true,
            confirmButtonText: "Cerrar caja",
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            preConfirm: () => {
                const contado = document.getElementById("swal-contado").value;
                const pin = document.getElementById("swal-pin")?.value;

                if (contado === "" || Number(contado) < 0) {
                    Swal.showValidationMessage("Ingresa el efectivo contado");
                    return false;
                }
                if (!esAdmin && !pin) {
                    Swal.showValidationMessage("Ingresa la Clave de Permiso");
                    return false;
                }
                return {
                    efectivo_contado: Number(contado),
                    observaciones: document.getElementById("swal-obs").value || null,
                    pin
                };
            }
        });

        if (!r.isConfirmed) return;

        try {
            const res = await cajaService.cerrar(r.value);
            const c = res.data;
            const dif = Number(c.diferencia);

            await Swal.fire({
                icon: dif === 0 ? "success" : "warning",
                title: "Caja cerrada",
                html: `
                    Efectivo esperado: <b>${soles(c.efectivo_esperado)}</b><br>
                    Efectivo contado: <b>${soles(c.efectivo_contado)}</b><br>
                    ${dif === 0
                        ? "<b>La caja cuadra.</b>"
                        : dif > 0
                            ? `<b class="text-success">Sobrante: ${soles(dif)}</b>`
                            : `<b class="text-danger">Faltante: ${soles(Math.abs(dif))}</b>`}
                `
            });

            cargar();
        } catch (error) {
            Swal.fire("No se pudo cerrar", obtenerMensajeError(error), "error");
        }
    };

    // ---------- EGRESO ----------
    const registrarEgreso = async () => {

    const r = await Swal.fire({
        title: "Registrar egreso",
        html: `
            <input id="swal-desc" class="swal2-input" placeholder="Descripción (ej. Pasajes)">
            <input id="swal-monto" type="number" step="0.01" min="0.01" class="swal2-input" placeholder="Monto (S/)">
            <select id="swal-metodo" class="swal2-input">
                ${METODOS.map(m => `<option value="${m}">${m}</option>`).join("")}
            </select>
            <select id="swal-rubro" class="swal2-input">
                <option value="">Sin rubro</option>
                <option value="TECNOLOGIA">Tecnología</option>
                <option value="VEHICULAR">Vehicular</option>
            </select>
        `,
        showCancelButton: true,
        confirmButtonText: "Registrar",
        cancelButtonText: "Cancelar",
        focusConfirm: false,
        preConfirm: () => {
            const descripcion = document.getElementById("swal-desc").value.trim();
            const monto = document.getElementById("swal-monto").value;

            if (!descripcion || !monto || Number(monto) <= 0) {
                Swal.showValidationMessage("Completa la descripción y un monto mayor a 0");
                return false;
            }

            return {
                descripcion,
                monto: Number(monto),
                metodo_pago: document.getElementById("swal-metodo").value,
                tipo_rubro: document.getElementById("swal-rubro").value || null,
            };
        }
    });

    if (!r.isConfirmed) return;

    try {
        const res = await cajaService.egreso(r.value);
        await Swal.fire("Listo", res.message, "success");
        cargar();
    } catch (error) {
        Swal.fire("No se pudo registrar", obtenerMensajeError(error), "error");
    }
};

    // ---------- ANULAR EGRESO (admin) ----------
    const anularEgreso = async (mov) => {

        const r = await Swal.fire({
            title: "¿Anular egreso?",
            text: `${mov.descripcion} - ${soles(mov.monto)}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, anular",
            cancelButtonText: "Cancelar"
        });

        if (!r.isConfirmed) return;

        try {
            await cajaService.anularMovimiento(mov.id);
            cargar();
        } catch (error) {
            Swal.fire("Error", obtenerMensajeError(error), "error");
        }
    };

    // ---------- CAMBIAR PIN (admin) ----------
    const cambiarPin = async () => {

        let configurado = false;
        try {
            configurado = (await cajaService.estadoPin()).configurado;
        } catch { /* se muestra igual */ }

        const r = await Swal.fire({
            title: configurado ? "Cambiar Clave de Permiso" : "Crear Clave de Permiso ",
            html: `
                <input id="swal-pin-nuevo" type="password" class="swal2-input" placeholder="PIN nuevo (mínimo 4 caracteres)">
                <input id="swal-pass" type="password" class="swal2-input" placeholder="Tu contraseña de administrador">
            `,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            preConfirm: () => {
                const pin_nuevo = document.getElementById("swal-pin-nuevo").value;
                const password = document.getElementById("swal-pass").value;

                if (pin_nuevo.length < 4 || !password) {
                    Swal.showValidationMessage("El PIN debe tener al menos 4 caracteres y debes confirmar tu contraseña");
                    return false;
                }
                return { pin_nuevo, password };
            }
        });

        if (!r.isConfirmed) return;

        try {
            const res = await cajaService.cambiarPin(r.value);
            Swal.fire("Listo", res.message, "success");
        } catch (error) {
            Swal.fire("Error", obtenerMensajeError(error), "error");
        }
    };

    // ---------- VISTA ----------
    const caja = data?.caja;
    const abierta = caja?.estado === "ABIERTA";

    return (
        <div>

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

                <div>
                    <h2>Caja</h2>
                    <p className="text-muted mb-0">{user?.name} {esAdmin && "(Administrador)"}</p>
                </div>

                {esAdmin && (
                    <button className="btn btn-outline-dark" onClick={cambiarPin}>
                        <i className="bi bi-key"></i> Clave de Permiso
                    </button>
                )}

            </div>

            {esAdmin && (
                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button className={`nav-link ${vista === "mia" ? "active" : ""}`} onClick={() => setVista("mia")}>
                            Mi caja
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${vista === "general" ? "active" : ""}`} onClick={() => setVista("general")}>
                            Caja general
                        </button>
                    </li>
                </ul>
            )}

            {vista === "general" && esAdmin ? <CajaGeneral /> : (

                cargando ? <div className="text-center">Cargando caja...</div> :

                !data ? (
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <h5>Tu caja de hoy aún no está abierta</h5>
                            <p className="text-muted">
                                {esAdmin ? "Ábrela para registrar cobros." : "Pide el PIN al administrador para abrirla."}
                            </p>
                            <button className="btn btn-primary" onClick={abrirCaja}>
                                <i className="bi bi-unlock"></i> Abrir caja
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {data.vencida && (
                            <div className="alert alert-warning">
                                Esta caja es del <b>{new Date(caja.fecha + "T00:00:00").toLocaleDateString("es-PE")}</b> y
                                sigue abierta. Ciérrala para poder abrir la de hoy.
                            </div>
                        )}

                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                            <span className={`badge fs-6 ${abierta ? "bg-success" : "bg-secondary"}`}>
                                {abierta ? "Caja abierta" : "Caja cerrada"}
                            </span>

                            <div className="d-flex gap-2">
                                {abierta && (
                                    <>
                                        <button className="btn btn-outline-danger" onClick={registrarEgreso}>
                                            <i className="bi bi-dash-circle"></i> Egreso
                                        </button>
                                        <button className="btn btn-dark" onClick={cerrarCaja}>
                                            <i className="bi bi-lock"></i> Cerrar caja
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <CajaResumen resumen={data.resumen} />

                        {!abierta && (
                            <div className="alert alert-secondary">
                                Esperado: <b>{soles(caja.efectivo_esperado)}</b> · Contado: <b>{soles(caja.efectivo_contado)}</b> ·
                                Diferencia: <b className={Number(caja.diferencia) < 0 ? "text-danger" : ""}>{soles(caja.diferencia)}</b>
                            </div>
                        )}

                        {!abierta && esAdmin && (
                            <div className="d-flex gap-2 mb-3">
                                <button className="btn btn-outline-dark btn-sm"
                                        onClick={async () => (await reabrirCaja(caja)) && cargar()}>
                                    Reabrir caja
                                </button>
                                <button className="btn btn-outline-warning btn-sm"
                                        onClick={async () => (await ajustarCaja(caja)) && cargar()}>
                                    Ajustar efectivo contado
                                </button>
                            </div>
                        )}

                        <MovimientosCajaTable
                            movimientos={data.movimientos}
                            puedeAnular={esAdmin}
                            cajaAbierta={abierta}
                            onAnular={anularEgreso}
                        />
                    </>
                )
            )}

        </div>
    );
}