import { Form, Row, Col } from "react-bootstrap";

export default function EquipoForm({
    formData,
    handleChange,
    clientes = [],
}) {
    return (
        <>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Cliente</Form.Label>

                        <Form.Select
                            name="cliente_id"
                            value={formData.cliente_id}
                            onChange={handleChange}
                        >
                            <option value="">
                                Seleccionar cliente
                            </option>

                            {clientes.map((cliente) => (
                                <option
                                    key={cliente.id}
                                    value={cliente.id}
                                >
                                    {cliente.razon_social
                                        ? cliente.razon_social
                                        : `${cliente.nombres || ""} ${cliente.apellidos || ""}`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Tipo de Equipo
                        </Form.Label>

                        <Form.Select
                            name="tipo_equipo"
                            value={formData.tipo_equipo}
                            onChange={handleChange}
                        >
                            <option value="CELULAR">
                                Celular
                            </option>

                            <option value="TABLET">
                                Tablet
                            </option>

                            <option value="LAPTOP">
                                Laptop
                            </option>

                            <option value="PC">
                                PC
                            </option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Marca</Form.Label>

                        <Form.Control
                            type="text"
                            name="marca"
                            value={formData.marca}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Modelo</Form.Label>

                        <Form.Control
                            type="text"
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>
                    Número de Serie
                </Form.Label>

                <Form.Control
                    type="text"
                    name="numero_serie"
                    value={formData.numero_serie}
                    onChange={handleChange}
                />
            </Form.Group>

            {(formData.tipo_equipo === "CELULAR" ||
                formData.tipo_equipo === "TABLET") && (
                <Form.Group className="mb-3">
                    <Form.Label>IMEI</Form.Label>

                    <Form.Control
                        type="text"
                        name="imei"
                        value={formData.imei}
                        onChange={handleChange}
                    />
                </Form.Group>
            )}

            {(formData.tipo_equipo === "LAPTOP" ||
                formData.tipo_equipo === "PC") && (
                <>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Procesador
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="procesador"
                                    value={formData.procesador}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    RAM
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="ram"
                                    value={formData.ram}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Almacenamiento
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="almacenamiento"
                                    value={
                                        formData.almacenamiento
                                    }
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    GPU / Tarjeta de Video
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    name="tarjeta_video"
                                    value={
                                        formData.tarjeta_video
                                    }
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </>
            )}

            <Form.Group className="mb-3">
                <Form.Label>
                    Observaciones
                </Form.Label>

                <Form.Control
                    as="textarea"
                    rows={3}
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                />
            </Form.Group>
        </>
    );
}