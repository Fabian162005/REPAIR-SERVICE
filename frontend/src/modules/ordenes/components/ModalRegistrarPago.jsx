import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { registrarPago } from "../services/ordenPagosService";
import obtenerMensajeError from "../../../utils/obtenerMensajeError";

const METODOS = ["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA", "OTROS"];

export default function ModalRegistrarPago({ show, onHide, orden, onPagoRegistrado }) {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        monto: "",
        metodo_pago: "EFECTIVO",
        observacion: ""
    });

    // Al abrir, sugiere el saldo pendiente
    useEffect(() => {
        if (show && orden) {
            setFormData({
                monto: Number(orden.saldo_pendiente || 0).toFixed(2),
                metodo_pago: "EFECTIVO",
                observacion: ""
            });
        }
    }, [show, orden]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const response = await registrarPago({
                orden_servicio_id: orden.id,
                monto: Number(formData.monto),
                metodo_pago: formData.metodo_pago,
                observacion: formData.observacion || null
            });

            onHide();

            await Swal.fire({
                icon: "success",
                title: "Pago registrado",
                timer: 1300,
                showConfirmButton: false
            });

            if (onPagoRegistrado) {
                await onPagoRegistrado(response);
            }

        } catch (error) {
            console.error("ERROR REGISTRANDO PAGO:", error?.response?.data || error);

            Swal.fire(
                "No se pudo registrar el pago",
                obtenerMensajeError(error, "Error al registrar pago"),
                "error"
            );

        } finally {
            setLoading(false);
        }
    };

    if (!orden) return null;

    return (
        <Modal show={show} onHide={onHide} centered>

            <Form onSubmit={handleSubmit}>

                <Modal.Header closeButton>
                    <Modal.Title>Registrar Pago - {orden.codigo_orden}</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <p className="text-muted">
                        Total: S/ {Number(orden.total).toFixed(2)} ·
                        Saldo: <b>S/ {Number(orden.saldo_pendiente).toFixed(2)}</b>
                    </p>

                    <Form.Group className="mb-3">
                        <Form.Label>Monto</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            min="0.01"
                            name="monto"
                            value={formData.monto}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Método</Form.Label>
                        <Form.Select
                            name="metodo_pago"
                            value={formData.metodo_pago}
                            onChange={handleChange}
                        >
                            {METODOS.map(m => <option key={m} value={m}>{m}</option>)}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Observación</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="observacion"
                            value={formData.observacion}
                            onChange={handleChange}
                        />
                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Pago"}
                    </Button>
                </Modal.Footer>

            </Form>

        </Modal>
    );
}