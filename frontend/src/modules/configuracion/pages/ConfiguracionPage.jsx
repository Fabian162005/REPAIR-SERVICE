import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import configService from "../services/configService";
import cajaService from "../../caja/Services/CajaService";
import obtenerMensajeError from "../../../utils/obtenerMensajeError";
import pedirClave from "../../../utils/pedirClave";
import useAuthStore from "../../../store/authStore";

/* ---------------- MI PERFIL ---------------- */

function PerfilTab({ esAdmin }) {

    const [form, setForm] = useState({ name: "", dni: "", telefono: "", direccion: "" });
    const [email, setEmail] = useState("");

    useEffect(() => {
        configService.perfil()
            .then((p) => {
                setEmail(p.email);
                setForm({
                    name: p.name || "",
                    dni: p.dni || "",
                    telefono: p.telefono || "",
                    direccion: p.direccion || "",
                });
            })
            .catch((e) => Swal.fire("Error", obtenerMensajeError(e), "error"));
    }, []);

    const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const guardar = async (e) => {
        e.preventDefault();

        let clave = null;

        if (!esAdmin) {
            clave = await pedirClave(
                "Editar perfil",
                "Para editar tu perfil necesitas la clave de permiso del administrador."
            );

            if (!clave) return;
        }

        try {
            const res = await configService.guardarPerfil({ ...form, clave_permiso: clave });

            // Actualiza el nombre guardado en el navegador
            const { token } = useAuthStore.getState();
            useAuthStore.getState().login(token, res.user);

            Swal.fire("Listo", res.message, "success");
        } catch (error) {
            Swal.fire("No se pudo guardar", obtenerMensajeError(error), "error");
        }
    };

    return (
        <form onSubmit={guardar} style={{ maxWidth: 520 }}>

            <div className="mb-3">
                <label className="form-label">Correo</label>
                <input className="form-control" value={email} disabled />
                <small className="text-muted">El correo y el rol solo los cambia el administrador.</small>
            </div>

            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input className="form-control" name="name" value={form.name} onChange={cambiar} required />
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">DNI</label>
                    <input className="form-control" name="dni" value={form.dni} onChange={cambiar} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Teléfono</label>
                    <input className="form-control" name="telefono" value={form.telefono} onChange={cambiar} />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Dirección</label>
                <input className="form-control" name="direccion" value={form.direccion} onChange={cambiar} />
            </div>

            <button className="btn btn-primary">Guardar perfil</button>

        </form>
    );
}

/* ---------------- SEGURIDAD ---------------- */

function SeguridadTab({ esAdmin }) {

    const [f, setF] = useState({ password_actual: "", password: "", password_confirmation: "" });

    const cambiar = (e) => setF({ ...f, [e.target.name]: e.target.value });

    const guardar = async (e) => {
        e.preventDefault();

        if (f.password.length < 8) {
            Swal.fire("Contraseña corta", "Debe tener al menos 8 caracteres.", "warning");
            return;
        }

        if (f.password !== f.password_confirmation) {
            Swal.fire("No coinciden", "La confirmación no es igual a la nueva contraseña.", "warning");
            return;
        }

        try {
            const res = await configService.cambiarPassword(f);
            setF({ password_actual: "", password: "", password_confirmation: "" });
            Swal.fire("Listo", res.message, "success");
        } catch (error) {
            Swal.fire("No se pudo cambiar", obtenerMensajeError(error), "error");
        }
    };

    const cambiarClave = async () => {

        let configurada = false;

        try {
            configurada = (await cajaService.estadoPin()).configurado;
        } catch { /* se muestra igual */ }

        const r = await Swal.fire({
            title: configurada ? "Cambiar clave de permiso" : "Crear clave de permiso",
            html: `
                <input id="swal-clave-nueva" type="password" class="swal2-input" placeholder="Clave nueva (mínimo 4 caracteres)">
                <input id="swal-pass" type="password" class="swal2-input" placeholder="Tu contraseña de administrador">
            `,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            preConfirm: () => {
                const pin_nuevo = document.getElementById("swal-clave-nueva").value;
                const password = document.getElementById("swal-pass").value;

                if (pin_nuevo.length < 4 || !password) {
                    Swal.showValidationMessage("La clave necesita 4 caracteres y debes confirmar tu contraseña");
                    return false;
                }

                return { pin_nuevo, password };
            },
        });

        if (!r.isConfirmed) return;

        try {
            const res = await cajaService.cambiarPin(r.value);
            Swal.fire("Listo", res.message, "success");
        } catch (error) {
            Swal.fire("Error", obtenerMensajeError(error), "error");
        }
    };

    return (
        <div style={{ maxWidth: 520 }}>

            <h5>Cambiar mi contraseña</h5>

            <form onSubmit={guardar} className="mb-4">
                <div className="mb-3">
                    <label className="form-label">Contraseña actual</label>
                    <input type="password" className="form-control" name="password_actual" value={f.password_actual} onChange={cambiar} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña nueva</label>
                    <input type="password" className="form-control" name="password" value={f.password} onChange={cambiar} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Repetir contraseña nueva</label>
                    <input type="password" className="form-control" name="password_confirmation" value={f.password_confirmation} onChange={cambiar} required />
                </div>
                <button className="btn btn-primary">Cambiar contraseña</button>
            </form>

            {esAdmin && (
                <>
                    <hr />
                    <h5>Clave de permiso</h5>
                    <p className="text-muted">
                        La usan los trabajadores para abrir y cerrar caja y editar órdenes, y tú para
                        reabrir cajas y eliminar pagos de una caja cerrada.
                    </p>
                    <button className="btn btn-outline-dark" onClick={cambiarClave}>
                        <i className="bi bi-key"></i> Cambiar clave de permiso
                    </button>
                </>
            )}

        </div>
    );
}

/* ---------------- NEGOCIO ---------------- */

function NegocioTab() {

    const [form, setForm] = useState({ nombre: "", ruc: "", direccion: "", telefono: "" });
    const [logo, setLogo] = useState(null);

    const aplicar = (n) => {
        setForm({
            nombre: n.nombre || "",
            ruc: n.ruc || "",
            direccion: n.direccion || "",
            telefono: n.telefono || "",
        });
        setLogo(n.logo_url);
    };

    useEffect(() => {
        configService.negocio()
            .then(aplicar)
            .catch((e) => Swal.fire("Error", obtenerMensajeError(e), "error"));
    }, []);

    const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const guardar = async (e) => {
        e.preventDefault();

        try {
            const res = await configService.guardarNegocio(form);
            aplicar(res.data);
            Swal.fire("Listo", res.message, "success");
        } catch (error) {
            Swal.fire("No se pudo guardar", obtenerMensajeError(error), "error");
        }
    };

    const subir = async (e) => {
        const archivo = e.target.files[0];
        e.target.value = "";

        if (!archivo) return;

        try {
            const res = await configService.subirLogo(archivo);
            setLogo(res.data.logo_url);
            Swal.fire("Listo", res.message, "success");
        } catch (error) {
            Swal.fire("No se pudo subir", obtenerMensajeError(error, "Usa PNG, JPG o WEBP de hasta 1 MB."), "error");
        }
    };

    return (
        <div className="row">

            <div className="col-md-6">
                <form onSubmit={guardar}>
                    <div className="mb-3">
                        <label className="form-label">Nombre del negocio</label>
                        <input className="form-control" name="nombre" value={form.nombre} onChange={cambiar} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">RUC</label>
                        <input className="form-control" name="ruc" value={form.ruc} onChange={cambiar} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <input className="form-control" name="direccion" value={form.direccion} onChange={cambiar} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Teléfono</label>
                        <input className="form-control" name="telefono" value={form.telefono} onChange={cambiar} />
                    </div>
                    <button className="btn btn-primary">Guardar datos</button>
                </form>
            </div>

            <div className="col-md-6">
                <label className="form-label">Logo</label>

                <div className="border rounded p-3 text-center mb-3" style={{ minHeight: 160 }}>
                    {logo
                        ? <img src={logo} alt="Logo" style={{ maxWidth: "100%", maxHeight: 140 }} />
                        : <span className="text-muted">Sin logo</span>}
                </div>

                <input type="file" className="form-control" accept="image/png,image/jpeg,image/webp" onChange={subir} />
                <small className="text-muted">PNG, JPG o WEBP, hasta 1 MB. Aparecerá en los PDFs.</small>
            </div>

        </div>
    );
}

/* ---------------- PLAN ---------------- */

function PlanTab() {

    const [p, setP] = useState(null);

    useEffect(() => {
        configService.plan().then(setP).catch(() => {});
    }, []);

    if (!p) return <div>Cargando...</div>;

    const fila = (etiqueta, valor) => (
        <tr><th style={{ width: 220 }}>{etiqueta}</th><td>{valor}</td></tr>
    );

    return (
        <div style={{ maxWidth: 520 }}>
            <table className="table">
                <tbody>
                    {fila("Plan", <span className="badge bg-dark">{p.plan}</span>)}
                    {fila("Rubros", p.rubros === "AMBOS" ? "Tecnología y Vehicular" : p.rubros)}
                    {fila("Administradores", `${p.uso.admins} de ${p.limites.admins}`)}
                    {fila("Trabajadores", `${p.uso.trabajadores} de ${p.limites.trabajadores}`)}
                    {fila("Vence el", p.vence_el
                        ? `${new Date(p.vence_el + "T00:00:00").toLocaleDateString("es-PE")} (${p.dias_restantes} días)`
                        : "Sin vencimiento")}
                </tbody>
            </table>

            <p className="text-muted">Para cambiar de plan, contacta al proveedor.</p>
        </div>
    );
}

/* ---------------- PÁGINA ---------------- */

export default function ConfiguracionPage() {

    const esAdmin = useAuthStore((s) => s.user?.rol) === "ADMIN";

    const pestañas = [
        { id: "perfil", titulo: "Mi perfil" },
        { id: "seguridad", titulo: "Seguridad" },
        ...(esAdmin ? [
            { id: "negocio", titulo: "Negocio" },
            { id: "plan", titulo: "Plan" },
        ] : []),
    ];

    const [tab, setTab] = useState("perfil");

    return (
        <div>

            <h2 className="mb-3">Configuración</h2>

            <ul className="nav nav-tabs mb-4">
                {pestañas.map((t) => (
                    <li className="nav-item" key={t.id}>
                        <button
                            className={`nav-link ${tab === t.id ? "active" : ""}`}
                            onClick={() => setTab(t.id)}
                        >
                            {t.titulo}
                        </button>
                    </li>
                ))}
            </ul>

            {tab === "perfil" && <PerfilTab esAdmin={esAdmin} />}
            {tab === "seguridad" && <SeguridadTab esAdmin={esAdmin} />}
            {tab === "negocio" && esAdmin && <NegocioTab />}
            {tab === "plan" && esAdmin && <PlanTab />}

        </div>
    );
}