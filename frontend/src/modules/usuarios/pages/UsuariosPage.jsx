import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import usuarioService from "../services/usuarioService";
import obtenerMensajeError from "../../../utils/obtenerMensajeError";
import useAuthStore from "../../../store/authStore";

import api from "../../../api/axios";

// Evita que comillas o símbolos rompan el HTML del Swal
const esc = (s) =>
    String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

export default function UsuariosPage() {

    const yo = useAuthStore((s) => s.user);
    const [usuarios, setUsuarios] = useState([]);

    const [plan, setPlan] = useState(null);

    const cargar = async () => {
    try {
        const [lista, p] = await Promise.all([
            usuarioService.listar(),
            api.get("/plan"),
        ]);

        setUsuarios(lista);
        setPlan(p.data.data);
    } catch (error) {
        Swal.fire("Error", obtenerMensajeError(error, "No se pudieron cargar los usuarios."), "error");
    }
};

    useEffect(() => { cargar(); }, []);

    // ---------- CREAR ----------
    const crear = async () => {

        const r = await Swal.fire({
            title: "Nuevo usuario",
            html: `
                <input id="u-name" class="swal2-input" placeholder="Nombre">
                <input id="u-email" type="email" class="swal2-input" placeholder="Correo">
                <input id="u-pass" type="password" class="swal2-input" placeholder="Contraseña (mín. 8)">
                <select id="u-rol" class="swal2-input">
                    <option value="TRABAJADOR">Trabajador</option>
                    <option value="ADMIN">Administrador</option>
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: "Crear",
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById("u-name").value.trim();
                const email = document.getElementById("u-email").value.trim();
                const password = document.getElementById("u-pass").value;

                if (!name || !email || password.length < 8) {
                    Swal.showValidationMessage("Completa nombre, correo y una contraseña de al menos 8 caracteres");
                    return false;
                }

                return { name, email, password, rol: document.getElementById("u-rol").value };
            },
        });

        if (!r.isConfirmed) return;

        try {
            const res = await usuarioService.crear(r.value);
            await Swal.fire("Listo", res.message, "success");
            cargar();
        } catch (error) {
            Swal.fire("No se pudo crear", obtenerMensajeError(error), "error");
        }
    };

    // ---------- EDITAR ----------
    const editar = async (u) => {

        const r = await Swal.fire({
            title: "Editar usuario",
            html: `
                <input id="u-name" class="swal2-input" value="${esc(u.name)}">
                <input id="u-email" type="email" class="swal2-input" value="${esc(u.email)}">
                <select id="u-rol" class="swal2-input">
                    <option value="TRABAJADOR" ${u.rol === "TRABAJADOR" ? "selected" : ""}>Trabajador</option>
                    <option value="ADMIN" ${u.rol === "ADMIN" ? "selected" : ""}>Administrador</option>
                </select>
                <input id="u-dni" class="swal2-input" placeholder="DNI" value="${esc(u.dni)}">
                <input id="u-tel" class="swal2-input" placeholder="Teléfono" value="${esc(u.telefono)}">
                <input id="u-dir" class="swal2-input" placeholder="Dirección" value="${esc(u.direccion)}">
            `,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById("u-name").value.trim();
                const email = document.getElementById("u-email").value.trim();

                if (!name || !email) {
                    Swal.showValidationMessage("Nombre y correo son obligatorios");
                    return false;
                }

                

                return {
                    name,
                    email,
                    rol: document.getElementById("u-rol").value,
                    activo: u.activo,
                    dni: document.getElementById("u-dni").value.trim() || null,
                    telefono: document.getElementById("u-tel").value.trim() || null,
                    direccion: document.getElementById("u-dir").value.trim() || null,
                };
            },
        });

        if (!r.isConfirmed) return;

        try {
            const res = await usuarioService.actualizar(u.id, r.value);
            await Swal.fire("Listo", res.message, "success");
            cargar();
        } catch (error) {
            Swal.fire("No se pudo actualizar", obtenerMensajeError(error), "error");
        }
    };

    // ---------- ACTIVAR / DESACTIVAR ----------
    const cambiarEstado = async (u) => {

        const r = await Swal.fire({
            title: u.activo ? "¿Desactivar usuario?" : "¿Activar usuario?",
            text: u.activo
                ? `${u.name} no podrá iniciar sesión. Su historial se conserva.`
                : `${u.name} podrá volver a iniciar sesión.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "Cancelar",
        });

        if (!r.isConfirmed) return;

        try {
            await usuarioService.actualizar(u.id, {
                name: u.name,
                email: u.email,
                rol: u.rol,
                activo: !u.activo,
            });
            cargar();
        } catch (error) {
            Swal.fire("No se pudo cambiar el estado", obtenerMensajeError(error), "error");
        }
    };

    // ---------- RESTABLECER CONTRASEÑA ----------
    const resetear = async (u) => {

        const r = await Swal.fire({
            title: `Nueva contraseña de ${u.name}`,
            input: "password",
            inputPlaceholder: "Mínimo 8 caracteres",
            showCancelButton: true,
            confirmButtonText: "Restablecer",
            cancelButtonText: "Cancelar",
            inputValidator: (v) => (!v || v.length < 8) && "Mínimo 8 caracteres",
        });

        if (!r.isConfirmed) return;

        try {
            const res = await usuarioService.resetPassword(u.id, r.value);
            Swal.fire("Listo", res.message, "success");
        } catch (error) {
            Swal.fire("Error", obtenerMensajeError(error), "error");
        }
    };

    return (
        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Usuarios</h2>
                    <p className="text-muted mb-0">Solo el administrador crea y gestiona cuentas.</p>
                </div>

                <button className="btn btn-primary" onClick={crear}>
                    <i className="bi bi-plus-circle"></i> Nuevo usuario
                </button>
            </div>

            {plan && (
    <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge bg-dark p-2">Plan {plan.plan}</span>
            <span className="badge bg-secondary p-2">
                Administradores {plan.uso.admins}/{plan.limites.admins}
            </span>
            <span className="badge bg-secondary p-2">
                Trabajadores {plan.uso.trabajadores}/{plan.limites.trabajadores}
            </span>
        </div>
    )}

            <div className="table-responsive">
                <table className="table table-hover align-middle">

                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id}>

                                <td>
                                    {u.name}{" "}
                                    {u.id === yo?.id && <span className="badge bg-info">Tú</span>}
                                </td>

                                <td>{u.email}</td>

                                <td>
                                    <span className={`badge ${u.rol === "ADMIN" ? "bg-dark" : "bg-primary"}`}>
                                        {u.rol}
                                    </span>
                                </td>


                                <td>
                                    <span className={`badge ${u.activo ? "bg-success" : "bg-secondary"}`}>
                                        {u.activo ? "Activo" : "Inactivo"}
                                    </span>
                                </td>

                                <td>
                                    <button className="btn btn-sm btn-warning me-2" title="Editar" onClick={() => editar(u)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>

                                    <button className="btn btn-sm btn-outline-dark me-2" title="Restablecer contraseña" onClick={() => resetear(u)}>
                                        <i className="bi bi-key"></i>
                                    </button>

                                    {u.id !== yo?.id && (
                                        <button
                                            className={`btn btn-sm ${u.activo ? "btn-danger" : "btn-success"}`}
                                            onClick={() => cambiarEstado(u)}
                                        >
                                            {u.activo ? "Desactivar" : "Activar"}
                                        </button>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}