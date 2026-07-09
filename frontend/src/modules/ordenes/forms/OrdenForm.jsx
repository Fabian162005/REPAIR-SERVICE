import {
    Row,
    Col,
    Form
} from "react-bootstrap";

import TecnologiaForm from "./TecnologiaForm";
import VehicularForm from "./VehicularForm";
import useDetalleOrden from "../hooks/useDetalleOrden";

import { useEffect } from "react";

export default function OrdenForm({
    formData,
    handleChange,
    clientes,
    equipos,
    vehiculos,

    setFormData,

    archivos,
    handleArchivos,
    archivosExistentes
}) {

const {
    agregarServicio,
    eliminarServicio,
    actualizarServicio,
    agregarRepuesto,
    eliminarRepuesto,
    actualizarRepuesto,
} = useDetalleOrden(setFormData);

useEffect(() => {

    const totalServicios =

        (formData.detalles || [])
            .reduce(

                (acc, item) =>

                    acc +
                    Number(item.precio || 0),

                0
            );

    const totalRepuestos =

        (formData.repuestos || [])
            .reduce(

                (acc, item) =>

                    acc +
                    Number(item.subtotal || 0),

                0
            );

    const totalCalculado =

        totalServicios +
        totalRepuestos;

    if (
        Number(formData.total || 0)
        !==
        totalCalculado
    ) {

        setFormData(prev => ({

            ...prev,

            total: totalCalculado

        }));

    }

}, [
    formData.detalles,
    formData.repuestos
]);



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

        {formData.tipo_rubro === "TECNOLOGIA" ? (

        <TecnologiaForm
            formData={formData}
            handleChange={handleChange}
            equipos={equipos}
            setFormData={setFormData}
            archivos={archivos}
            handleArchivos={handleArchivos}
            archivosExistentes={archivosExistentes}
            agregarServicio={agregarServicio}
            eliminarServicio={eliminarServicio}
            actualizarServicio={actualizarServicio}
            agregarRepuesto={agregarRepuesto}
            eliminarRepuesto={eliminarRepuesto}
            actualizarRepuesto={actualizarRepuesto}
        />

    ) : (

        <VehicularForm
            formData={formData}
            handleChange={handleChange}
            vehiculos={vehiculos}
            setFormData={setFormData}
            archivos={archivos}
            handleArchivos={handleArchivos}
            archivosExistentes={archivosExistentes}

            agregarServicio={agregarServicio}
            eliminarServicio={eliminarServicio}
            actualizarServicio={actualizarServicio}

            agregarRepuesto={agregarRepuesto}
            eliminarRepuesto={eliminarRepuesto}
            actualizarRepuesto={actualizarRepuesto}
        />

    )} 

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
                        disabled
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