import {
    Modal,
    Row,
    Col,
    Card,
    Badge
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

            </Modal.Body>

        </Modal>

    );
}