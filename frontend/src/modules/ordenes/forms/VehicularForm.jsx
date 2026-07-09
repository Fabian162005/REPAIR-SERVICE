import { Row, Col, Form, Card, Button, Table } from "react-bootstrap";
import { CHECKLIST_VEHICULAR } from "../constants/checklistVehicular";
import { SERVICIOS_VEHICULARES } from "../constants/serviciosVehiculares";

export default function VehicularForm({
    formData,
    handleChange,
    vehiculos,
    setFormData,
    archivos,
    handleArchivos,
    archivosExistentes,

    agregarServicio,
    eliminarServicio,
    actualizarServicio,

    agregarRepuesto,
    eliminarRepuesto,
    actualizarRepuesto,
}) {
    return (
        <>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Vehículo</Form.Label>
                        <Form.Select name="vehiculo_id" value={formData.vehiculo_id} onChange={handleChange}>
                            <option value="">Seleccione</option>
                            {vehiculos.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.placa} - {v.marca} {v.modelo}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={12}>
    <Form.Group className="mb-3">

        <Form.Label>
            Falla Reportada / Problema del vehículo
        </Form.Label>

        <Form.Control
            as="textarea"
            rows={3}
            name="falla_reportada"
            value={formData.falla_reportada || ""}
            onChange={handleChange}
        />

    </Form.Group>
</Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Kilometraje Ingreso</Form.Label>
                        <Form.Control type="number" name="kilometraje_ingreso" value={formData.kilometraje_ingreso} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Combustible Ingreso</Form.Label>
                        <Form.Control name="combustible_ingreso" value={formData.combustible_ingreso} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Ingreso</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="fecha_ingreso_recepcion"
                            value={formData.fecha_ingreso_recepcion}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Diagnóstico Motor</Form.Label>
                        <Form.Control as="textarea" rows={2} name="diagnostico_motor" value={formData.diagnostico_motor} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Diagnóstico Transmisión</Form.Label>
                        <Form.Control as="textarea" rows={2} name="diagnostico_transmision" value={formData.diagnostico_transmision} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Diagnóstico Suspensión</Form.Label>
                        <Form.Control as="textarea" rows={2} name="diagnostico_suspension" value={formData.diagnostico_suspension} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Diagnóstico Frenos</Form.Label>
                        <Form.Control as="textarea" rows={2} name="diagnostico_frenos" value={formData.diagnostico_frenos} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Diagnóstico Eléctrico</Form.Label>
                        <Form.Control as="textarea" rows={2} name="diagnostico_electrico" value={formData.diagnostico_electrico} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Observaciones</Form.Label>
                        <Form.Control as="textarea" rows={3} name="diagnostico_observaciones" value={formData.diagnostico_observaciones} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Checklist Vehicular</Form.Label>
                        {CHECKLIST_VEHICULAR.map((item) => (
                            <Form.Check
                                key={item.name}
                                type="checkbox"
                                label={item.label}
                                checked={!!formData[item.name]}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        [item.name]: e.target.checked,
                                    }))
                                }
                            />
                        ))}
                    </Form.Group>
                </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Servicios Vehiculares</Form.Label>
                            {SERVICIOS_VEHICULARES.map((item) => (
                                <Form.Check
                                    key={item.name}
                                    type="checkbox"
                                    label={item.label}
                                    checked={!!formData[item.name]}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [item.name]: e.target.checked,
                                        }))
                                    }
                                />
                            ))}
                        </Form.Group>
                    </Col>

                    <Col md={12}>

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

                    <th>
                        Descripción
                    </th>

                    <th width="120">
                        Precio
                    </th>

                    <th width="80">
                        Acción
                    </th>

                </tr>

            </thead>


            <tbody>

            {(formData.detalles || []).map(
                (item,index)=>(

                <tr key={index}>

                    <td>

                        <Form.Control

                            value={
                                item.descripcion || ""
                            }

                            onChange={(e)=>
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

                            value={
                                item.precio || ""
                            }

                            onChange={(e)=>
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

    </Col>





    <Col md={12}>


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

    <th>
    Nombre
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

    <th>
    Acción
    </th>


    </tr>


    </thead>



    <tbody>


    {(formData.repuestos || []).map(
    (item,index)=>(


    <tr key={index}>


    <td>

    <Form.Control

    value={
    item.nombre || ""
    }

    onChange={(e)=>
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

    value={
    item.cantidad || 1
    }

    onChange={(e)=>
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

    value={
    item.precio_unitario || ""
    }

    onChange={(e)=>
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

    disabled

    value={
    item.subtotal || 0
    }

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
                        <Form.Label>Próximo Mantenimiento - Fecha</Form.Label>
                        <Form.Control type="date" name="proximo_fecha" value={formData.proximo_fecha} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Próximo Mantenimiento - Kilómetros</Form.Label>
                        <Form.Control type="number" name="proximo_kilometros" value={formData.proximo_kilometros} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Indicaciones</Form.Label>
                        <Form.Control as="textarea" rows={3} name="proximo_indicaciones" value={formData.proximo_indicaciones} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Card className="mb-3">
                        <Card.Header>Subir Evidencia Fotográfica</Card.Header>
                        <Card.Body>
                            <Form.Control type="file" multiple onChange={handleArchivos} />
                            <div className="mt-3">
                                {archivos?.length > 0 &&
                                    archivos.map((archivo, index) => (
                                        <div key={index} className="mb-2">
                                            📷 {archivo.name}
                                        </div>
                                    ))}
                            </div>
                        </Card.Body>
                    </Card>
                    {archivosExistentes?.length > 0 && (
                        <div className="mb-3">
                            <h6>Fotos registradas</h6>
                            <div className="row">
                                {archivosExistentes.map((archivo) => (
                                    <div className="col-md-6 mb-3" key={archivo.id}>
                                        <img
                                            src={`http://127.0.0.1:8000/storage/${archivo.archivo}`}
                                            alt=""
                                            className="img-fluid rounded border"
                                            style={{ height: "220px", width: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </>
    );
}
