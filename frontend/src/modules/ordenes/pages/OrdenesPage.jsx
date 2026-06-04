import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";

import OrdenModal from "../components/OrdenModal";
import OrdenDetalleModal from "../components/OrdenDetalleModal";

import {
    getOrden,
    getOrdenes,
    deleteOrden,
} from "../services/ordenService";

export default function OrdenesPage() {

    const [ordenes, setOrdenes] =
        useState([]);

    const [buscar, setBuscar] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);


    const [ordenEditar, setOrdenEditar] =
        useState(null);

    const [showDetalle, setShowDetalle] =
    useState(false);

    const [ordenDetalle, setOrdenDetalle] =
        useState(null);

    const navigate = useNavigate()

    const cargarOrdenes = async () => {

    try {

        const response =
            await getOrdenes(buscar);

        console.log(
            response.data.data
        );

        setOrdenes(
            response.data.data || []
        );

    } catch (error) {

        console.error(error);

    }
};

    useEffect(() => {

        cargarOrdenes();

    }, []);

    const handleBuscar = (
        e
    ) => {

        e.preventDefault();

        cargarOrdenes();
    };

    const handleDetalle = async (id) => {

    try {

        const response =
            await getOrden(id);

        setOrdenDetalle(
            response.data
        );

        setShowDetalle(
            true
        );

    } catch (error) {

        console.error(error);

    }
};

    const handleEliminar =
        async (id) => {

            const result =
                await Swal.fire({

                    title:
                        "¿Eliminar orden?",

                    text:
                        "Esta acción no se puede deshacer",

                    icon:
                        "warning",

                    showCancelButton:
                        true,

                    confirmButtonText:
                        "Sí, eliminar",

                    cancelButtonText:
                        "Cancelar",
                });

            if (
                !result.isConfirmed
            )
                return;

            try {

                await deleteOrden(id);

                await Swal.fire({

                    icon:
                        "success",

                    title:
                        "Orden eliminada",

                    timer:
                        1500,

                    showConfirmButton:
                        false,
                });

                cargarOrdenes();

            } catch (error) {

                console.error(error);

            }
        };

    return (

        <DashboardLayout>

            <div className="container-fluid">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2>
                        Órdenes de Servicio
                    </h2>

                    <button
                        className="btn btn-primary"
                        onClick={() => {

                            setOrdenEditar(
                                null
                            );

                            setShowModal(
                                true
                            );
                        }}
                    >
                        Nueva Orden
                    </button>

                </div>

                <form
                    onSubmit={
                        handleBuscar
                    }
                    className="mb-3"
                >

                    <div className="input-group">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar..."
                            value={buscar}
                            onChange={(e) =>
                                setBuscar(
                                    e.target.value
                                )
                            }
                        />

                        <button className="btn btn-dark">

                            Buscar

                        </button>

                    </div>

                </form>

                <div className="table-responsive">

                    <table className="table table-bordered table-hover">

                        <thead className="table-dark">

                            <tr>

                                <th>
                                    Código
                                </th>

                                <th>
                                    Cliente
                                </th>

                                <th>
                                    Equipo
                                </th>

                                <th>
                                    Estado
                                </th>

                                <th>
                                    Prioridad
                                </th>

                                <th>
                                    Total
                                </th>

                                <th>
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                ordenes.map(
                                    (
                                        orden
                                    ) => (

                                        <tr
                                            key={
                                                orden.id
                                            }
                                        >

                                            <td>
                                                {
                                                    orden.codigo_orden
                                                }
                                            </td>

                                            <td>
                                                {
                                                    orden.cliente?.nombres
                                                }{" "}
                                                {
                                                    orden.cliente?.apellidos
                                                }
                                            </td>

                                            <td>
                                                {
                                                    orden.equipo?.marca
                                                }{" "}
                                                {
                                                    orden.equipo?.modelo
                                                }
                                            </td>

                                          <td>

                                            <span
                                                className={
                                                    orden.estado_actual === "RECEPCIONADO"
                                                        ? "badge bg-secondary"

                                                    : orden.estado_actual === "DIAGNOSTICO"
                                                        ? "badge bg-info"

                                                    : orden.estado_actual === "ESPERANDO_APROBACION"
                                                        ? "badge bg-warning text-dark"

                                                    : orden.estado_actual === "EN_REPARACION"
                                                        ? "badge bg-primary"

                                                    : orden.estado_actual === "REPARADO"
                                                        ? "badge bg-success"

                                                    : orden.estado_actual === "ENTREGADO"
                                                        ? "badge bg-dark"

                                                    : "badge bg-danger"
                                                }
                                            >

                                                {orden.estado_actual}

                                            </span>

                                        </td>

                                            

                                            <td>
                                                {
                                                    orden.prioridad
                                                }
                                            </td>

                                            <td>
                                                S/
                                                {
                                                    orden.total
                                                }
                                            </td>

                                            <td>
                                               <button
                                                className="btn btn-info btn-sm me-2"
                                                onClick={() =>
                                                    handleDetalle(
                                                        orden.id
                                                    )
                                                }
                                            >
                                                Detalle
                                            </button>

                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => {

                                                        setOrdenEditar(
                                                            orden
                                                        );

                                                        setShowModal(
                                                            true
                                                        );

                                                    }}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleEliminar(
                                                            orden.id
                                                        )
                                                    }
                                                >
                                                    Eliminar
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )
                            }

                        </tbody>

                    </table>

                </div>

            </div>

            {
                showModal && (

                    <OrdenModal

                        show={
                            showModal
                        }

                        handleClose={() => {

                            setShowModal(
                                false
                            );

                            setOrdenEditar(
                                null
                            );
                        }}

                        orden={
                            ordenEditar
                        }

                        onSuccess={
                            cargarOrdenes
                        }

                    />

                )
            }

            <OrdenDetalleModal
                show={showDetalle}
                handleClose={() =>
                    setShowDetalle(false)
                }
                orden={ordenDetalle}
            />

        </DashboardLayout>

    );
}