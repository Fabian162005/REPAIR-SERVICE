import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import OrdenForm from "./OrdenForm";

import {
    createOrden,
    updateOrden,
} from "../services/ordenService";

import {
    obtenerClientes,
} from "../../clientes/services/clienteService";

import {
    getEquipos,
} from "../../equipos/services/equipoService";

const initialState = {

    cliente_id: "",
    equipo_id: "",

    tipo_rubro: "TECNOLOGIA",

    falla_reportada: "",

    accesorios: "",
    contrasena: "",

    prioridad: "MEDIA",

    fecha_ingreso:
        new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),

    total: 0,
    adelanto: 0,

    estado_actual: "RECEPCIONADO",

    diagnostico_preliminar: "",

    diagnostico_final: "",
};

export default function OrdenModal({
    show,
    handleClose,
    orden = null,
    onSuccess,
}) {

    const [clientes, setClientes] =
        useState([]);

    const [equipos, setEquipos] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState(initialState);

    useEffect(() => {

        cargarClientes();
        cargarEquipos();

    }, []);

    useEffect(() => {

        if (orden) {

            setFormData({
                ...initialState,
                ...orden,
            });

        } else {

            setFormData(
                initialState
            );

        }

    }, [orden]);

    const cargarClientes = async () => {

    try {

     const response =
    await obtenerClientes();

    setClientes(
        response.data.data || []
    );

      

    } catch (error) {

        console.error(error);

    }
};

    const cargarEquipos =
        async () => {

            try {

                const response =
                    await getEquipos();

                setEquipos(
                    response.data.data || []
                );

            } catch (error) {

                console.error(error);

            }
        };

   const handleChange = (e) => {

    const { name, value } = e.target;

    console.log(name, value);

    setFormData(prev => ({
        ...prev,
        [name]: value,
    }));
};

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                setLoading(true);

                if (orden) {

                    await updateOrden(
                        orden.id,
                        formData
                    );

                } else {

                    await createOrden(
                        formData
                    );

                }

              if (onSuccess) {

                    await onSuccess();

                }

                handleClose();
            } catch (error) {

    console.error(error);

    console.log(
        error.response?.data
    );

    alert(
        JSON.stringify(
            error.response?.data,
            null,
            2
        )
    );
}
        };

    return (

        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            centered
        >

            <Form
                onSubmit={handleSubmit}
            >

                <Modal.Header closeButton>

                    <Modal.Title>

                        {
                            orden
                                ? "Editar Orden"
                                : "Nueva Orden"
                        }

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <OrdenForm
                        formData={formData}
                        handleChange={handleChange}
                        clientes={clientes}
                        equipos={equipos}
                    />

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Guardando..."
                                : "Guardar"
                        }
                    </Button>

                </Modal.Footer>

            </Form>

        </Modal>

    );
}