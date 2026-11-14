import Swal from "sweetalert2";
import cajaService from "./Services/CajaService";
import obtenerMensajeError from "../../utils/obtenerMensajeError";
import usuarioService from "../usuarios/services/usuarioService";

const soles = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

export async function reabrirCaja(caja) {

    const r = await Swal.fire({
        title: "Reabrir caja",
        html: `
            <p class="mb-2">Se reabrirá la caja del ${caja.fecha}.</p>
            <input id="swal-motivo" class="swal2-input" placeholder="Motivo (mín. 5 caracteres)">
            <input id="swal-clave" type="password" class="swal2-input" placeholder="Clave de permiso">
        `,
        showCancelButton: true,
        confirmButtonText: "Reabrir",
        cancelButtonText: "Cancelar",
        focusConfirm: false,
        preConfirm: () => {
            const motivo = document.getElementById("swal-motivo").value.trim();
            const clave = document.getElementById("swal-clave").value;

            if (motivo.length < 5 || !clave) {
                Swal.showValidationMessage("Escribe un motivo (mín. 5 caracteres) y la clave");
                return false;
            }
            return { motivo, clave_permiso: clave };
        }
    });

    if (!r.isConfirmed) return false;

    try {
        const res = await cajaService.reabrir(caja.id, r.value);
        await Swal.fire("Listo", res.message, "success");
        return true;
    } catch (error) {
        Swal.fire("No se pudo reabrir", obtenerMensajeError(error), "error");
        return false;
    }
}

export async function ajustarCaja(caja) {

    const r = await Swal.fire({
        title: "Ajustar efectivo contado",
        html: `
            <p class="mb-2">Esperado: <b>${soles(caja.efectivo_esperado)}</b> · Contado actual: <b>${soles(caja.efectivo_contado)}</b></p>
            <input id="swal-contado" type="number" step="0.01" min="0" class="swal2-input" placeholder="Nuevo efectivo contado (S/)">
            <input id="swal-motivo" class="swal2-input" placeholder="Motivo (mín. 5 caracteres)">
            <input id="swal-clave" type="password" class="swal2-input" placeholder="Clave de permiso">
        `,
        showCancelButton: true,
        confirmButtonText: "Ajustar",
        cancelButtonText: "Cancelar",
        focusConfirm: false,
        preConfirm: () => {
            const contado = document.getElementById("swal-contado").value;
            const motivo = document.getElementById("swal-motivo").value.trim();
            const clave = document.getElementById("swal-clave").value;

            if (contado === "" || motivo.length < 5 || !clave) {
                Swal.showValidationMessage("Completa el monto, el motivo (mín. 5 caracteres) y la clave");
                return false;
            }
            return { efectivo_contado: Number(contado), motivo, clave_permiso: clave };
        }
    });

    if (!r.isConfirmed) return false;

    try {
        const res = await cajaService.ajustar(caja.id, r.value);
        await Swal.fire("Listo", res.message, "success");
        return true;
    } catch (error) {
        Swal.fire("No se pudo ajustar", obtenerMensajeError(error), "error");
        return false;
    }
    
}

export async function abrirCajaDe() {

    let usuarios = [];

    try {
        usuarios = await usuarioService.listar(true);
    } catch (error) {
        Swal.fire("Error", obtenerMensajeError(error), "error");
        return false;
    }

    const r = await Swal.fire({
        title: "Abrir caja de un usuario",
        html: `
            <select id="swal-user" class="swal2-input">
                ${usuarios.map(u => `<option value="${u.id}">${u.name}</option>`).join("")}
            </select>
            <input id="swal-monto" type="number" step="0.01" min="0" class="swal2-input" placeholder="Monto de apertura (S/)">
        `,
        showCancelButton: true,
        confirmButtonText: "Abrir",
        cancelButtonText: "Cancelar",
        focusConfirm: false,
        preConfirm: () => {
            const monto = document.getElementById("swal-monto").value;

            if (monto === "") {
                Swal.showValidationMessage("Ingresa el monto de apertura");
                return false;
            }

            return {
                usuario_id: Number(document.getElementById("swal-user").value),
                monto_apertura: Number(monto),
            };
        }
    });

    if (!r.isConfirmed) return false;

    try {
        const res = await cajaService.abrir(r.value);
        await Swal.fire("Listo", res.message, "success");
        return true;
    } catch (error) {
        Swal.fire("No se pudo abrir", obtenerMensajeError(error), "error");
        return false;
    }
}