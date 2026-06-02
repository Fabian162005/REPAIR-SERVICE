import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import EquipoForm from "./EquipoForm";

import {
    createEquipo,
    updateEquipo,
} from "../services/equipoService";

import {
    obtenerClientes,
} from "../../clientes/services/clienteService";

const initialState = {
    cliente_id: "",

    tipo_equipo: "CELULAR",

    marca: "",
    modelo: "",

    imei: "",
    numero_serie: "",

    procesador: "",
    ram: "",
    almacenamiento: "",
    tarjeta_video: "",

    observaciones: "",
};

export default function EquipoModal({
    show,
    handleClose,
    equipo = null,
    onSuccess,
}) {
    const [clientes, setClientes] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState(initialState);

    useEffect(() => {

        cargarClientes();

    }, []);

    useEffect(() => {

        if (equipo) {

            setFormData({
                ...initialState,
                ...equipo,
            });

        } else {

            setFormData(initialState);

        }

    }, [equipo]);

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

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();

        try {

            setLoading(true);

            if (equipo) {

                await updateEquipo(
                    equipo.id,
                    formData
                );

            } else {

                await createEquipo(
                    formData
                );

            }

            if (onSuccess) {

                onSuccess();

            }

            handleClose();

        } catch (error) {

            console.error(error);

            alert(
                "Error al guardar"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered
        >
            <Form
                onSubmit={
                    handleSubmit
                }
            >
                <Modal.Header closeButton>

                    <Modal.Title>

                        {
                            equipo
                                ? "Editar Equipo"
                                : "Nuevo Equipo"
                        }

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <EquipoForm
                        formData={
                            formData
                        }
                        handleChange={
                            handleChange
                        }
                        clientes={
                            clientes
                        }
                    />

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={
                            handleClose
                        }
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={
                            loading
                        }
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