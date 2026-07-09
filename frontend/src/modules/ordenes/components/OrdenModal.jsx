import { Modal, Button, Form } from "react-bootstrap";
import OrdenForm from "../forms/OrdenForm";
import useOrdenForm from "../hooks/useOrdenForm";

export default function OrdenModal({ show, handleClose, orden = null, onSuccess }) {
    const formProps = useOrdenForm({ orden, onSuccess, onClose: handleClose });
const {
    loading,
    handleSubmit,
    ...form
} = formProps;

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{orden ? "Editar Orden" : "Nueva Orden"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <OrdenForm {...form} />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" disabled={formProps.loading}>
                        {formProps.loading ? "Guardando..." : "Guardar"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
