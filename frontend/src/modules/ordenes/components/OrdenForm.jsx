import {
    Row,
    Col,
    Form,
    Button,
    Table
} from "react-bootstrap";

export default function OrdenForm({
    formData,
    handleChange,
    clientes,
    equipos,
    setFormData
}) {

    const agregarServicio = () => {

    setFormData(prev => ({

        ...prev,

        detalles: [

            ...(prev.detalles || []),

            {
                descripcion: "",
                precio: 0
            }

        ]

    }));

};

const eliminarServicio = (index) => {

    setFormData(prev => ({

        ...prev,

        detalles:
            prev.detalles.filter(
                (_, i) => i !== index
            )

    }));

};

const agregarRepuesto = () => {

    setFormData(prev => ({

        ...prev,

        repuestos: [

            ...(prev.repuestos || []),

            {

                nombre: "",

                cantidad: 1,

                precio_unitario: 0,

                subtotal: 0

            }

        ]

    }));

};

const eliminarRepuesto = (index) => {

    setFormData(prev => ({

        ...prev,

        repuestos:
            prev.repuestos.filter(
                (_, i) => i !== index
            )

    }));

};

const actualizarServicio = (
    index,
    campo,
    valor
) => {

    setFormData(prev => {

        const detalles = [
            ...(prev.detalles || [])
        ];

        detalles[index] = {
            ...detalles[index],
            [campo]: valor
        };

        return {
            ...prev,
            detalles
        };
    });

};

const actualizarRepuesto = (
    index,
    campo,
    valor
) => {

    setFormData(prev => {

        const repuestos = [
            ...(prev.repuestos || [])
        ];

        repuestos[index] = {
            ...repuestos[index],
            [campo]: valor
        };

        if (
            campo === "cantidad" ||
            campo === "precio_unitario"
        ) {

            repuestos[index].subtotal =

                Number(
                    repuestos[index].cantidad || 0
                )

                *

                Number(
                    repuestos[index].precio_unitario || 0
                );
        }

        return {

            ...prev,

            repuestos

        };

    });

};

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

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5>
                        Servicios Realizados
                    </h5>

                    <Button
                        size="sm"
                        onClick={agregarServicio}
                    >
                        + Servicio
                    </Button>

                </div>

               <Table bordered>

                <thead>

                    <tr>

                        <th>Descripción</th>

                        <th width="120">Precio</th>

                        <th width="80">Acción</th>

                    </tr>

                </thead>

                <tbody>

                    {(formData.detalles || []).map((item, index) => (

                        <tr key={index}>

                            <td>

                                <Form.Control
                                    value={item.descripcion}
                                    onChange={(e) =>
                                        actualizarServicio(
                                            index,
                                            "descripcion",
                                            e.target.value
                                        )
                                    }
                                />

                            </td>

                            <td>

                                <Form.Control
                                    type="number"
                                    value={item.precio}
                                    onChange={(e) =>
                                        actualizarServicio(
                                            index,
                                            "precio",
                                            e.target.value
                                        )
                                    }
                                />

                            </td>

                            <td>

                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                        eliminarServicio(index)
                                    }
                                >
                                    X
                                </Button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </Table>

            <hr />

<div className="d-flex justify-content-between align-items-center mb-3">

    <h5>
        Repuestos Utilizados
    </h5>

    <Button
        size="sm"
        variant="success"
        onClick={agregarRepuesto}
    >
        + Repuesto
    </Button>

</div>

<Table bordered>

    <thead>

        <tr>

            <th>Nombre</th>

            <th width="100">Cantidad</th>

            <th width="120">P.Unit</th>

            <th width="120">Subtotal</th>

            <th width="80">Acción</th>

        </tr>

    </thead>

    <tbody>

        {(formData.repuestos || []).map((item, index) => (

            <tr key={index}>

                <td>

                    <Form.Control
                        value={item.nombre}
                        onChange={(e) =>
                            actualizarRepuesto(
                                index,
                                "nombre",
                                e.target.value
                            )
                        }
                    />

                </td>

                <td>

                    <Form.Control
                        type="number"
                        value={item.cantidad}
                        onChange={(e) =>
                            actualizarRepuesto(
                                index,
                                "cantidad",
                                e.target.value
                            )
                        }
                    />

                </td>

                <td>

                    <Form.Control
                        type="number"
                        value={item.precio_unitario}
                        onChange={(e) =>
                            actualizarRepuesto(
                                index,
                                "precio_unitario",
                                e.target.value
                            )
                        }
                    />

                </td>

                <td>

                    <Form.Control
                        value={item.subtotal}
                        disabled
                    />

                </td>

                <td>

                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                            eliminarRepuesto(index)
                        }
                    >
                        X
                    </Button>

                </td>

            </tr>

        ))}

    </tbody>

</Table>

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