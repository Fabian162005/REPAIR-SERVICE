import {
    Modal,
    Button,
    Form
} from "react-bootstrap";

import {
    useState
} from "react";

import {
    registrarPago
}
from "../services/ordenPagosService";

export default function ModalRegistrarPago({

    show,
    onHide,

    orden,

    onPagoRegistrado

}) {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] =
        useState({

            monto: "",

            metodo_pago:
                "EFECTIVO",

            observacion: ""
        });

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value
        });
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
        const response = await registrarPago({
            orden_servicio_id: orden.id,
            monto: formData.monto,
            metodo_pago: formData.metodo_pago,
            observacion: formData.observacion
        });

        setFormData({
            monto: "",
            metodo_pago: "EFECTIVO",
            observacion: ""
        });

        onHide();

        // 🔥 IMPORTANTE: refrescar orden desde padre
        if (onPagoRegistrado) {
            await onPagoRegistrado(response);
        }

    } catch (error) {
        console.error("ERROR REGISTRANDO PAGO:", error?.response?.data || error);

        alert(
            error?.response?.data?.message ||
            "Error al registrar pago"
        );

    } finally {
        setLoading(false);
    }
};

    return (

        <Modal
            show={show}
            onHide={onHide}
            centered
        >

            <Form
                onSubmit={handleSubmit}
            >

                <Modal.Header closeButton>

                    <Modal.Title>

                        Registrar Pago

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <Form.Group
                        className="mb-3"
                    >

                        <Form.Label>

                            Monto

                        </Form.Label>

                        <Form.Control
                            type="number"
                            step="0.01"
                            min="0.01"
                            name="monto"
                            value={
                                formData.monto
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />

                    </Form.Group>

                    <Form.Group
                        className="mb-3"
                    >

                        <Form.Label>

                            Método

                        </Form.Label>

                        <Form.Select
                            name="metodo_pago"
                            value={
                                formData.metodo_pago
                            }
                            onChange={
                                handleChange
                            }
                        >

                            <option>
                                EFECTIVO
                            </option>

                            <option>
                                YAPE
                            </option>

                            <option>
                                PLIN
                            </option>

                            <option>
                                TRANSFERENCIA
                            </option>

                            <option>
                                TARJETA
                            </option>

                        </Form.Select>

                    </Form.Group>

                    <Form.Group>

                        <Form.Label>

                            Observación

                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="observacion"
                            value={
                                formData.observacion
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={onHide}
                    >
                        Cancelar
                    </Button>

                    <Button type="submit" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Pago"}
                    </Button>
                </Modal.Footer>

            </Form>

        </Modal>
    );
}