import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import OrdenModal from "../components/OrdenModal";
import OrdenDetalleModal from "../components/OrdenDetalleModal";
import { useRubro } from "../../../context/RubroContext";
import useAuthStore from "../../../store/authStore";

import obtenerMensajeError from "../../../utils/obtenerMensajeError";

import {
    getOrden,
    getOrdenes,
    deleteOrden,
    cambiarEstadoOrden,
} from "../services/ordenService";

const ESTADOS = [
    "RECEPCIONADO",
    "DIAGNOSTICO",
    "ESPERANDO_APROBACION",
    "EN_REPARACION",
    "REPARADO",
    "ENTREGADO",
];

const claseEstado = (estado) => {
    switch (estado) {
        case "RECEPCIONADO": return "badge bg-secondary";
        case "DIAGNOSTICO": return "badge bg-info";
        case "ESPERANDO_APROBACION": return "badge bg-warning text-dark";
        case "EN_REPARACION": return "badge bg-primary";
        case "REPARADO": return "badge bg-success";
        case "ENTREGADO": return "badge bg-dark";
        default: return "badge bg-danger";
    }
};

export default function OrdenesPage() {

    const { rubro } = useRubro();

    const esAdmin = useAuthStore((s) => s.user?.rol) === "ADMIN";

    const [ordenes, setOrdenes] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [ordenEditar, setOrdenEditar] = useState(null);
    const [showDetalle, setShowDetalle] = useState(false);
    const [ordenDetalle, setOrdenDetalle] = useState(null);

    const cargarOrdenes = async () => {
        try {
            const response = await getOrdenes(buscar);

            setOrdenes(
                (response.data.data || []).filter(
                    (orden) => orden.tipo_rubro === rubro
                )
            );

        } catch (error) {
            console.error(error);
            Swal.fire(
                "Error",
                obtenerMensajeError(error, "No se pudieron cargar las órdenes."),
                "error"
            );
        }
    };

    useEffect(() => {
        cargarOrdenes();
    }, [rubro]);

    const handleBuscar = (e) => {
        e.preventDefault();
        cargarOrdenes();
    };

    const handleDetalle = async (id) => {
        try {
            const response = await getOrden(id);
            setOrdenDetalle(response.data);
            setShowDetalle(true);

        } catch (error) {
            console.error(error);
            Swal.fire(
                "Error",
                obtenerMensajeError(error, "No se pudo cargar el detalle."),
                "error"
            );
        }
    };

    const handleEditar = async (id) => {
        try {
            const response = await getOrden(id);
            setOrdenEditar(response.data);
            setShowModal(true);

        } catch (error) {
            console.error(error);
            Swal.fire(
                "Error",
                obtenerMensajeError(error, "No se pudo cargar la orden."),
                "error"
            );
        }
    };

    const handleEstado = async (orden) => {

        const r = await Swal.fire({
            title: `Estado de ${orden.codigo_orden}`,
            html: `
                <select id="swal-estado" class="swal2-input">
                    ${ESTADOS.map(e => `
                        <option value="${e}" ${e === orden.estado_actual ? "selected" : ""}>
                            ${e.replaceAll("_", " ")}
                        </option>
                    `).join("")}
                </select>
                <input id="swal-obs" class="swal2-input" placeholder="Observación (opcional)">
            `,
            showCancelButton: true,
            confirmButtonText: "Cambiar estado",
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            preConfirm: () => {
                const estado = document.getElementById("swal-estado").value;

                if (estado === orden.estado_actual) {
                    Swal.showValidationMessage("Elige un estado distinto al actual");
                    return false;
                }

                return {
                    estado_actual: estado,
                    observacion: document.getElementById("swal-obs").value || null,
                };
            },
        });

        if (!r.isConfirmed) return;

        try {
            await cambiarEstadoOrden(orden.id, r.value);

            await Swal.fire({
                icon: "success",
                title: "Estado actualizado",
                timer: 1200,
                showConfirmButton: false,
            });

            cargarOrdenes();

        } catch (error) {
            Swal.fire(
                "No se pudo cambiar el estado",
                obtenerMensajeError(error),
                "error"
            );
        }
    };

    const handleEliminar = async (id) => {

        const result = await Swal.fire({
            title: "¿Eliminar orden?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteOrden(id);

            await Swal.fire({
                icon: "success",
                title: "Orden eliminada",
                timer: 1500,
                showConfirmButton: false,
            });

            cargarOrdenes();

        } catch (error) {
            console.error(error);
            Swal.fire(
                "Error",
                obtenerMensajeError(error, "No se pudo eliminar la orden."),
                "error"
            );
        }
    };

    // Se llama al registrar un pago: refresca el detalle y la lista
    const recargarOrdenDetalle = async () => {

        cargarOrdenes();

        if (!ordenDetalle?.id) return;

        try {
            const response = await getOrden(ordenDetalle.id);
            setOrdenDetalle(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    return (

        <div>

            <div className="container-fluid">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2>
                        {rubro === "TECNOLOGIA"
                            ? "Órdenes Tecnología"
                            : "Órdenes Vehiculares"}
                    </h2>

                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setOrdenEditar(null);
                            setShowModal(true);
                        }}
                    >
                        Nueva Orden
                    </button>

                </div>

                <form onSubmit={handleBuscar} className="mb-3">

                    <div className="input-group">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar..."
                            value={buscar}
                            onChange={(e) => setBuscar(e.target.value)}
                        />

                        <button className="btn btn-dark">Buscar</button>

                    </div>

                </form>

                <div className="table-responsive">

                    <table className="table table-bordered table-hover align-middle">

                        <thead className="table-dark">
                            <tr>
                                <th>Código</th>
                                <th>Cliente</th>
                                <th>{rubro === "TECNOLOGIA" ? "Equipo" : "Vehículo"}</th>
                                <th>Estado</th>
                                <th>Prioridad</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {ordenes.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No hay órdenes
                                    </td>
                                </tr>
                            )}

                            {ordenes.map((orden) => (

                                <tr key={orden.id}>

                                    <td>{orden.codigo_orden}</td>

                                    <td>
                                        {orden.cliente?.nombres} {orden.cliente?.apellidos}
                                    </td>

                                    <td>
                                        {rubro === "TECNOLOGIA"
                                            ? <>{orden.equipo?.marca} {orden.equipo?.modelo}</>
                                            : <>{orden.vehiculo?.marca} {orden.vehiculo?.modelo}</>
                                        }
                                    </td>

                                    <td>
                                        <span className={claseEstado(orden.estado_actual)}>
                                            {orden.estado_actual}
                                        </span>
                                    </td>

                                    <td>{orden.prioridad}</td>

                                    <td>S/ {orden.total}</td>

                                    <td>

                                        <button
                                            className="btn btn-info btn-sm me-2"
                                            onClick={() => handleDetalle(orden.id)}
                                        >
                                            Detalle
                                        </button>

                                        <button
                                            className="btn btn-secondary btn-sm me-2"
                                            onClick={() => handleEstado(orden)}
                                        >
                                            Estado
                                        </button>

                                         <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => handleEditar(orden.id)}
                                                >
                                                    Editar
                                        </button>

                                        {esAdmin && (
                                            <>
                                               
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleEliminar(orden.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {showModal && (
                <OrdenModal
                    show={showModal}
                    handleClose={() => {
                        setShowModal(false);
                        setOrdenEditar(null);
                    }}
                    orden={ordenEditar}
                    onSuccess={cargarOrdenes}
                />
            )}

            <OrdenDetalleModal
                show={showDetalle}
                handleClose={() => setShowDetalle(false)}
                orden={ordenDetalle}
                onPagoRegistrado={recargarOrdenDetalle}
            />

        </div>

    );
}