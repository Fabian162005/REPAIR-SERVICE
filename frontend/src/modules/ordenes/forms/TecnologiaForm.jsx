import { Row, Col, Form, Button, Table, Card } from "react-bootstrap";
import { ACCESORIOS_TECNOLOGIA } from "../constants/accesoriosTecnologia";
import { CHECKLIST_TECNOLOGIA } from "../constants/checklistTecnologia";

export default function TecnologiaForm({
    formData,
    handleChange,
    equipos,
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
                        <Form.Label>Equipo</Form.Label>
                        <Form.Select name="equipo_id" value={formData.equipo_id} onChange={handleChange}>
                            <option value="">Seleccione</option>
                            {equipos.map((equipo) => (
                                <option key={equipo.id} value={equipo.id}>
                                    {equipo.marca} {equipo.modelo}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Falla Reportada</Form.Label>
                        <Form.Control as="textarea" rows={3} name="falla_reportada" value={formData.falla_reportada} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Diagnóstico Preliminar</Form.Label>
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
                        <Form.Label>Diagnóstico Final</Form.Label>
                        <Form.Control as="textarea" rows={3} name="diagnostico_final" value={formData.diagnostico_final || ""} onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Servicios Realizados</h5>
                        <Button size="sm" onClick={agregarServicio}>
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
                                            onChange={(e) => actualizarServicio(index, "descripcion", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={item.precio}
                                            onChange={(e) => actualizarServicio(index, "precio", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => eliminarServicio(index)}>
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
                        <h5>Repuestos Utilizados</h5>
                        <Button size="sm" variant="success" onClick={agregarRepuesto}>
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
                                        <Form.Control value={item.nombre} onChange={(e) => actualizarRepuesto(index, "nombre", e.target.value)} />
                                    </td>
                                    <td>
                                        <Form.Control type="number" value={item.cantidad} onChange={(e) => actualizarRepuesto(index, "cantidad", e.target.value)} />
                                    </td>
                                    <td>
                                        <Form.Control type="number" value={item.precio_unitario} onChange={(e) => actualizarRepuesto(index, "precio_unitario", e.target.value)} />
                                    </td>
                                    <td>
                                        <Form.Control value={item.subtotal} disabled />
                                    </td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => eliminarRepuesto(index)}>
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
                        <Form.Label>Accesorios Entregados</Form.Label>
                        {ACCESORIOS_TECNOLOGIA.map((item) => (
                            <Form.Check
                                key={item}
                                type="checkbox"
                                label={item}
                                checked={(formData.accesorios || []).includes(item)}
                                onChange={(e) => {
                                    const actuales = formData.accesorios || [];
                                    setFormData((prev) => ({
                                        ...prev,
                                        accesorios: e.target.checked
                                            ? [...actuales, item]
                                            : actuales.filter((x) => x !== item),
                                    }));
                                }}
                            />
                        ))}
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Checklist de Recepción</Form.Label>
                        {CHECKLIST_TECNOLOGIA.map((item) => (
                            <Form.Check
                                key={item}
                                type="checkbox"
                                label={item}
                                checked={(formData.checklist_recepcion || []).includes(item)}
                                onChange={(e) => {
                                    const actuales = formData.checklist_recepcion || [];
                                    setFormData((prev) => ({
                                        ...prev,
                                        checklist_recepcion: e.target.checked ? [...actuales, item] : actuales.filter((x) => x !== item),
                                    }));
                                }}
                            />
                        ))}
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
