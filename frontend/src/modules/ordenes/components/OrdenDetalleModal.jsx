import {
    Modal,
    Row,
    Col,
    Card,
    Badge,
    Table,
    Button
} from "react-bootstrap";

import { useState, useEffect } from "react";
import axios from "axios";

import ModalRegistrarPago from "./ModalRegistrarPago";

export default function OrdenDetalleModal({
    show,
    handleClose,
    orden,
    onPagoRegistrado
}) {

    // =========================
    // STATE (SIEMPRE ARRIBA)
    // =========================
    const [ordenLocal, setOrdenLocal] = useState(null);
    const [showPago, setShowPago] = useState(false);

    // =========================
    // SYNC ORDEN PADRE -> LOCAL
    // =========================
    useEffect(() => {
        setOrdenLocal(orden);
    }, [orden]);

    // =========================
    // EARLY RETURN DESPUÉS DE HOOKS
    // =========================
    if (!ordenLocal) return null;

    // =========================
    // RECARGA ORDEN (API)
    // =========================
    const recargarOrden = async () => {
        const res = await axios.get(
            `/api/ordenes-servicio/${ordenLocal.id}`
        );
        return res.data;
    };

    // =========================
    // ESTADO BLOQUEO PAGO
    // =========================
    const pagoBloqueado = ordenLocal?.estado_pago === "PAGADO";

    // =========================
    // COLOR ESTADO
    // =========================
    const getEstadoColor = () => {
        switch (ordenLocal.estado_actual) {
            case "RECEPCIONADO":
                return "secondary";
            case "DIAGNOSTICO":
                return "info";
            case "ESPERANDO_APROBACION":
                return "warning";
            case "EN_REPARACION":
                return "primary";
            case "REPARADO":
                return "success";
            case "ENTREGADO":
                return "dark";
            default:
                return "danger";
        }
    };

    const getBadgeColor = (estado) => {
        switch (estado) {
            case "RECEPCIONADO":
                return "secondary";
            case "DIAGNOSTICO":
                return "info";
            case "ESPERANDO_APROBACION":
                return "warning";
            case "EN_REPARACION":
                return "primary";
            case "REPARADO":
                return "success";
            case "ENTREGADO":
                return "dark";
            default:
                return "danger";
        }
    };

    // =========================
    // REFRESH DESDE PAGO
    // =========================
    const handlePagoRegistrado = async (nuevaOrden) => {
        try {
            const data = await recargarOrden();

            setOrdenLocal(data);
            onPagoRegistrado?.(data);

        } catch (error) {
            console.error("Error recargando orden:", error);
        }
    };

    return (

        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            centered
        >

            <Modal.Header closeButton>

                <Modal.Title>

                    Orden:
                    {" "}
                    {ordenLocal.codigo_orden}

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Row>

                    <Col md={6}>

                        <Card className="mb-3">

                            <Card.Header>
                                Cliente
                            </Card.Header>

                            <Card.Body>

                                <p>
                                    <strong>Nombre:</strong>
                                    {" "}
                                    {ordenLocal.cliente?.nombres}
                                    {" "}
                                    {ordenLocal.cliente?.apellidos}
                                </p>

                                <p>
                                    <strong>Celular:</strong>
                                    {" "}
                                    {ordenLocal.cliente?.celular}
                                </p>

                                <p>
                                    <strong>Documento:</strong>
                                    {" "}
                                    {ordenLocal.cliente?.numero_documento}
                                </p>

                            </Card.Body>

                        </Card>

                    </Col>

                    <Col md={6}>

                        <Card className="mb-3">

                            <Card.Header>
                                Equipo
                            </Card.Header>

                            <Card.Body>

                                <p>
                                    <strong>Marca:</strong>
                                    {" "}
                                    {ordenLocal.equipo?.marca}
                                </p>

                                <p>
                                    <strong>Modelo:</strong>
                                    {" "}
                                    {ordenLocal.equipo?.modelo}
                                </p>

                                <p>
                                    <strong>IMEI:</strong>
                                    {" "}
                                    {ordenLocal.equipo?.imei}
                                </p>

                                <p>
                                    <strong>Serie:</strong>
                                    {" "}
                                    {ordenLocal.equipo?.numero_serie}
                                </p>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>

                <Card className="mb-3">

                    <Card.Header>
                        Servicio
                    </Card.Header>

                    <Card.Body>

                        <p>
                            <strong>Falla Reportada:</strong>
                        </p>

                        <p>
                            {ordenLocal.falla_reportada}
                        </p>

                        <hr />

                        <p>
                            <strong>
                                Diagnóstico Preliminar:
                            </strong>
                        </p>

                        <p>
                            {
                                ordenLocal.diagnostico_preliminar
                                || "-"
                            }
                        </p>

                        <hr />

                        <p>
                            <strong>
                                Diagnóstico Final:
                            </strong>
                        </p>

                        <p>
                            {
                                ordenLocal.diagnostico_final
                                || "-"
                            }
                        </p>

                    </Card.Body>

                </Card>

                <Row>

                    <Col md={6}>

                        <Card className="mb-3">

                            <Card.Header>
                                Estado
                            </Card.Header>

                            <Card.Body>

                                <Badge
                                    bg={
                                        getEstadoColor()
                                    }
                                >
                                    {
                                        ordenLocal.estado_actual
                                    }
                                </Badge>

                                <div className="mt-3">

                                    <strong>
                                        Prioridad:
                                    </strong>

                                    {" "}

                                    {
                                        ordenLocal.prioridad
                                    }

                                </div>

                            </Card.Body>

                        </Card>

<Card className="mb-3">

    <Card.Header>

        Evidencia Fotográfica

    </Card.Header>

    <Card.Body>

        <div className="row">

{
    ordenLocal.archivos?.map(
        archivo => (

            <div
                className="col-md-6 mb-3"
                key={archivo.id}
            >

                <img
                    src={
                        `http://127.0.0.1:8000/storage/${archivo.archivo}`
                    }
                    className="img-fluid rounded border"
                    alt=""
                />

            </div>

        )
    )
}

</div>

    </Card.Body>

</Card>


                    </Col>

                    <Col md={6}>

                        <Card className="mb-3">

                            <Card.Header>
                                Finanzas
                            </Card.Header>

                            <Button
                            size="sm"
                            variant="success"
                            onClick={() => setShowPago(true)}
                            disabled={pagoBloqueado}
                        >
                            Registrar Pago
                        </Button>


                            <Card.Body>

                                <p>
                                    <strong>Total:</strong>
                                    {" "}
                                    S/
                                    {" "}
                                    {ordenLocal.total}
                                </p>

                                <p>
                                    <strong>Adelanto:</strong>
                                    {" "}
                                    S/
                                    {" "}
                                    {ordenLocal.adelanto}
                                </p>

                                <p>
                                    <strong>
                                        Saldo Pendiente:
                                    </strong>
                                    {" "}
                                    S/
                                    {" "}
                                    {
                                        ordenLocal.saldo_pendiente
                                    }
                                </p>

                                <Badge bg={
                                    ordenLocal.estado_pago === "PAGADO"
                                        ? "success"
                                        : ordenLocal.estado_pago === "PAGO_PARCIAL"
                                        ? "warning"
                                        : "danger"
                                }>
                                    {ordenLocal.estado_pago}
                                </Badge>


                            </Card.Body>

                        </Card>

                        <Card className="mb-3">

                            <Card.Header>

                                Servicios Realizados

                            </Card.Header>

                            <Card.Body>

                                {
                                    ordenLocal.detalles?.length > 0
                                    ? (

                                        <Table
                                            striped
                                            bordered
                                            hover
                                            responsive
                                        >

                                            <thead>

                                                <tr>

                                                    <th>
                                                        Descripción
                                                    </th>

                                                    <th
                                                        width="120"
                                                    >
                                                        Precio
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {
                                                    ordenLocal.detalles.map(
                                                        (
                                                            item
                                                        ) => (

                                                            <tr
                                                                key={
                                                                    item.id
                                                                }
                                                            >

                                                                <td>
                                                                    {
                                                                        item.descripcion
                                                                    }
                                                                </td>

                                                                <td>

                                                                    S/

                                                                    {" "}

                                                                    {
                                                                        Number(
                                                                            item.precio
                                                                        )
                                                                        .toFixed(
                                                                            2
                                                                        )
                                                                    }

                                                                </td>

                                                            </tr>

                                                        )
                                                    )
                                                }

                                            </tbody>

                                        </Table>

                                    )

                                    :

                                    <p className="text-muted">

                                        No hay servicios registrados.

                                    </p>
                                }

                            </Card.Body>

                        </Card>

                        <Card className="mb-3">

                        <Card.Header>

                            Repuestos Utilizados

                        </Card.Header>

                        <Card.Body>

                            {
                                ordenLocal.repuestos?.length > 0
                                ? (

                                    <Table
                                        striped
                                        bordered
                                        hover
                                        responsive
                                    >

                                        <thead>

                                            <tr>

                                                <th>
                                                    Repuesto
                                                </th>

                                                <th>
                                                    Cantidad
                                                </th>

                                                <th>
                                                    P.Unit
                                                </th>

                                                <th>
                                                    Subtotal
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                ordenLocal.repuestos.map(
                                                    (
                                                        item
                                                    ) => (

                                                        <tr
                                                            key={
                                                                item.id
                                                            }
                                                        >

                                                            <td>
                                                                {
                                                                    item.nombre
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    item.cantidad
                                                                }
                                                            </td>

                                                            <td>

                                                                S/

                                                                {" "}

                                                                {
                                                                    Number(
                                                                        item.precio_unitario
                                                                    )
                                                                    .toFixed(
                                                                        2
                                                                    )
                                                                }

                                                            </td>

                                                            <td>

                                                                S/

                                                                {" "}

                                                                {
                                                                    Number(
                                                                        item.subtotal
                                                                    )
                                                                    .toFixed(
                                                                        2
                                                                    )
                                                                }

                                                            </td>

                                                        </tr>

                                                    )
                                                )
                                            }

                                        </tbody>

                                    </Table>

                                )

                                :

                                <p className="text-muted">

                                    No hay repuestos registrados.

                                </p>
                            }

                        </Card.Body>

                    </Card>

                    </Col>

                </Row>

                <Card>

                    <Card.Header>
                        Observaciones
                    </Card.Header>



                    <Card.Body>

                        <p>
                            <strong>
                                Cliente:
                            </strong>
                        </p>

                        <p>
                            {
                                ordenLocal.observaciones_cliente
                                || "-"
                            }
                        </p>

                        <hr />

                        <p>
                            <strong>
                                Técnico:
                            </strong>
                        </p>

                        <p>
                            {
                                ordenLocal.observaciones_tecnico
                                || "-"
                            }
                        </p>

                    </Card.Body>

                </Card>

                <Card className="mt-3">

                <Card.Header
                    className="bg-dark text-white"
                >
                    Timeline de la Orden
                </Card.Header>

                <Card.Body>

                    {
                        ordenLocal.estados?.length > 0 ? (

                            <div className="position-relative">

                                {
                                    ordenLocal.estados.map(
                                        (item, index) => (

                                            <div
                                                key={item.id}
                                                className="d-flex mb-4"
                                            >

                                                {/* Columna izquierda */}

                                                <div
                                                    className="d-flex flex-column align-items-center me-3"
                                                >

                                                    <div
                                                        className={`rounded-circle bg-${
                                                            getBadgeColor(
                                                                item.estado
                                                            )
                                                        }`}
                                                        style={{
                                                            width: "18px",
                                                            height: "18px"
                                                        }}
                                                    />

                                                    {
                                                        index !==
                                                        ordenLocal.estados.length - 1 && (

                                                            <div
                                                                style={{
                                                                    width: "2px",
                                                                    flex: 1,
                                                                    minHeight: "50px",
                                                                    background: "#dee2e6"
                                                                }}
                                                            />

                                                        )
                                                    }

                                                </div>

                                                {/* Contenido */}

                                                <Card
                                                    className="flex-grow-1 shadow-sm"
                                                >

                                                    <Card.Body>

                                                        <div className="d-flex justify-content-between">

                                                            <Badge
                                                                bg={
                                                                    getBadgeColor(
                                                                        item.estado
                                                                    )
                                                                }
                                                            >
                                                                {item.estado}
                                                            </Badge>

                                                            <small className="text-muted">

                                                                {
                                                                    new Date(
                                                                        item.created_at
                                                                    ).toLocaleString(
                                                                        "es-PE"
                                                                    )
                                                                }

                                                            </small>

                                                        </div>

                                                        <hr />

                                                        <div>

                                                            <strong>
                                                                Usuario:
                                                            </strong>

                                                            {" "}

                                                            {
                                                                item.usuario?.name ||
                                                                "Sistema"
                                                            }

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                Observación:
                                                            </strong>

                                                            {" "}

                                                            {
                                                                item.observacion ||
                                                                "-"
                                                            }

                                                        </div>

                                                    </Card.Body>

                                                </Card>

                                            </div>

                                        )
                                    )
                                }

                            </div>

                        ) : (

                            <p className="text-muted">

                                No existe historial.

                            </p>

                        )
                    }

                </Card.Body>

            </Card>

            </Modal.Body>

            <ModalRegistrarPago
                show={showPago}
                onHide={() => setShowPago(false)}
                orden={orden}
                onPagoRegistrado={handlePagoRegistrado}
            />

        </Modal>

    );
}