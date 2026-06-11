import {
    Modal,
    Row,
    Col,
    Card,
    Badge,
    Table
} from "react-bootstrap";

export default function OrdenDetalleModal({
    show,
    handleClose,
    orden
}) {

    if (!orden) return null;

    const getEstadoColor = () => {

        switch (orden.estado_actual) {

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
                    {orden.codigo_orden}

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
                                    {orden.cliente?.nombres}
                                    {" "}
                                    {orden.cliente?.apellidos}
                                </p>

                                <p>
                                    <strong>Celular:</strong>
                                    {" "}
                                    {orden.cliente?.celular}
                                </p>

                                <p>
                                    <strong>Documento:</strong>
                                    {" "}
                                    {orden.cliente?.numero_documento}
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
                                    {orden.equipo?.marca}
                                </p>

                                <p>
                                    <strong>Modelo:</strong>
                                    {" "}
                                    {orden.equipo?.modelo}
                                </p>

                                <p>
                                    <strong>IMEI:</strong>
                                    {" "}
                                    {orden.equipo?.imei}
                                </p>

                                <p>
                                    <strong>Serie:</strong>
                                    {" "}
                                    {orden.equipo?.numero_serie}
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
                            {orden.falla_reportada}
                        </p>

                        <hr />

                        <p>
                            <strong>
                                Diagnóstico Preliminar:
                            </strong>
                        </p>

                        <p>
                            {
                                orden.diagnostico_preliminar
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
                                orden.diagnostico_final
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
                                        orden.estado_actual
                                    }
                                </Badge>

                                <div className="mt-3">

                                    <strong>
                                        Prioridad:
                                    </strong>

                                    {" "}

                                    {
                                        orden.prioridad
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
    orden.archivos?.map(
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

                            <Card.Body>

                                <p>
                                    <strong>Total:</strong>
                                    {" "}
                                    S/
                                    {" "}
                                    {orden.total}
                                </p>

                                <p>
                                    <strong>Adelanto:</strong>
                                    {" "}
                                    S/
                                    {" "}
                                    {orden.adelanto}
                                </p>

                                <p>
                                    <strong>
                                        Saldo Pendiente:
                                    </strong>
                                    {" "}
                                    S/
                                    {" "}
                                    {
                                        orden.saldo_pendiente
                                    }
                                </p>

                            </Card.Body>

                        </Card>

                        <Card className="mb-3">

                            <Card.Header>

                                Servicios Realizados

                            </Card.Header>

                            <Card.Body>

                                {
                                    orden.detalles?.length > 0
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
                                                    orden.detalles.map(
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
                                orden.repuestos?.length > 0
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
                                                orden.repuestos.map(
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
                                orden.observaciones_cliente
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
                                orden.observaciones_tecnico
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
                        orden.estados?.length > 0 ? (

                            <div className="position-relative">

                                {
                                    orden.estados.map(
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
                                                        orden.estados.length - 1 && (

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

        </Modal>

    );
}