import { Row, Col, Form } from "react-bootstrap";

export default function OrdenForm({
    formData,
    handleChange,
    clientes,
    equipos,
}) {

    return (

        <Row>

            <Col md={6}>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Cliente
                    </Form.Label>

                    <Form.Select
                        name="cliente_id"
                        value={formData.cliente_id}
                        onChange={handleChange}
                    >

                        <option value="">
                            Seleccione
                        </option>

                        {
                            clientes.map(cliente => (

                                <option
                                    key={cliente.id}
                                    value={cliente.id}
                                >
                                    {cliente.nombres} {cliente.apellidos}
                                </option>

                            ))
                        }

                    </Form.Select>

                </Form.Group>

            </Col>

            <Col md={6}>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Equipo
                    </Form.Label>

                    <Form.Select
                        name="equipo_id"
                        value={formData.equipo_id}
                        onChange={handleChange}
                    >

                        <option value="">
                            Seleccione
                        </option>

                        {
                            equipos.map(equipo => (

                                <option
                                    key={equipo.id}
                                    value={equipo.id}
                                >
                                    {equipo.marca} {equipo.modelo}
                                </option>

                            ))
                        }

                    </Form.Select>

                </Form.Group>

            </Col>

            <Col md={12}>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Falla Reportada
                    </Form.Label>

                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="falla_reportada"
                        value={formData.falla_reportada}
                        onChange={handleChange}
                    />

                </Form.Group>

            </Col>

            <Col md={12}>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Diagnóstico Preliminar
                    </Form.Label>

                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="diagnostico_preliminar"
                        value={formData.diagnostico_preliminar || ""}
                        onChange={handleChange}
                    />

                </Form.Group>

            </Col>

            <Col md={12}>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Diagnóstico Final
                    </Form.Label>

                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="diagnostico_final"
                        value={formData.diagnostico_final || ""}
                        onChange={handleChange}
                    />

                </Form.Group>

            </Col>

            <Col md={6}>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Accesorios
                    </Form.Label>

                    <Form.Control
                        name="accesorios"
                        value={formData.accesorios}
                        onChange={handleChange}
                    />

                </Form.Group>

            </Col>

            <Col md={6}>

            <Form.Group className="mb-3">

                <Form.Label>
                    Estado
                </Form.Label>

                <Form.Select
                    name="estado_actual"
                    value={formData.estado_actual}
                    onChange={handleChange}
                >

                    <option value="RECEPCIONADO">
                        RECEPCIONADO
                    </option>

                    <option value="DIAGNOSTICO">
                        DIAGNOSTICO
                    </option>

                    <option value="ESPERANDO_APROBACION">
                        ESPERANDO APROBACION
                    </option>

                    <option value="EN_REPARACION">
                        EN REPARACION
                    </option>

                    <option value="REPARADO">
                        REPARADO
                    </option>

                    <option value="ENTREGADO">
                        ENTREGADO
                    </option>

                    <option value="CANCELADO">
                        CANCELADO
                    </option>

                </Form.Select>

            </Form.Group>

        </Col>

            <Col md={6}>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Contraseña
                    </Form.Label>

                    <Form.Control
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                    />

                </Form.Group>

            </Col>

            <Col md={4}>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Prioridad
                    </Form.Label>

                    <Form.Select
                        name="prioridad"
                        value={formData.prioridad}
                        onChange={handleChange}
                    >

                        <option value="BAJA">BAJA</option>
                        <option value="MEDIA">MEDIA</option>
                        <option value="ALTA">ALTA</option>
                        <option value="URGENTE">URGENTE</option>

                    </Form.Select>

                </Form.Group>

            </Col>

            <Col md={4}>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Total
                    </Form.Label>

                    <Form.Control
                        type="number"
                        name="total"
                        value={formData.total}
                        onChange={handleChange}
                    />

                </Form.Group>

            </Col>

            <Col md={4}>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Adelanto
                    </Form.Label>

                    <Form.Control
                        type="number"
                        name="adelanto"
                        value={formData.adelanto}
                        onChange={handleChange}
                    />

                </Form.Group>

            </Col>

            <Col md={4}>

                <Form.Group className="mb-3">

                    <Form.Label>
                        Saldo Pendiente
                    </Form.Label>

                    <Form.Control
                        type="number"
                        value={
                            (
                                Number(formData.total || 0)
                                -
                                Number(formData.adelanto || 0)
                            ).toFixed(2)
                        }
                        disabled
                    />

                </Form.Group>

            </Col>

        </Row>

    );
}