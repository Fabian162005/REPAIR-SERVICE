import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import {
    subirArchivoOrden
} from "../services/ordenArchivoService";

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

    accesorios: [],
    contrasena: "",

    checklist_recepcion: [],

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

    detalles: [],
    repuestos: [],
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

    const [archivos, setArchivos] =
        useState([]);

    const [archivosExistentes, setArchivosExistentes] =
            useState([]);

const handleArchivos = (e) => {

    const files =
        Array.from(
            e.target.files
        );

    if (files.length > 2) {

        alert(
            "Solo se permiten 2 fotos."
        );

        return;
    }

    setArchivos(files);
};

    useEffect(() => {

        cargarClientes();
        cargarEquipos();

    }, []);

useEffect(() => {

    if (orden) {

        setArchivosExistentes(
            orden.archivos || []
        );

        setFormData({
            ...initialState,
            ...orden,

            accesorios: orden.accesorios
                ? JSON.parse(orden.accesorios)
                : [],

            checklist_recepcion:
                orden.checklist_recepcion
                    ? JSON.parse(
                        orden.checklist_recepcion
                    )
                    : [],
        });

    } else {

        setFormData(
            initialState
        );

        setArchivosExistentes([]);

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


    setFormData(prev => ({
        ...prev,
        [name]: value,
    }));
};

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        setLoading(true);

        if (orden) {

            const payload = {

                ...formData,

                accesorios:
                    JSON.stringify(
                        formData.accesorios || []
                    ),

                checklist_recepcion:
                    JSON.stringify(
                        formData.checklist_recepcion || []
                    )

            };

            await updateOrden(
                orden.id,
                payload
            );

        } else {

            const payload = {

                ...formData,

                accesorios:
                    JSON.stringify(
                        formData.accesorios || []
                    ),

                checklist_recepcion:
                    JSON.stringify(
                        formData.checklist_recepcion || []
                    )

            };

            const response =
                await createOrden(
                    payload
                );

            const ordenCreada =
                response.data.orden;

            if (
                archivos.length > 0
            ) {

                for (const archivo of archivos)
                {

                    const formDataArchivo =
                        new FormData();

                    formDataArchivo.append(
                        "orden_servicio_id",
                        ordenCreada.id
                    );

                    formDataArchivo.append(
                        "tipo",
                        "RECEPCION"
                    );

                    formDataArchivo.append(
                        "archivo",
                        archivo
                    );

                    await subirArchivoOrden(
                        formDataArchivo
                    );

                }

            }

        }

        if (onSuccess) {

            await onSuccess();

        }

        handleClose();

    } catch (error) {

        console.error(error);

        alert(
            JSON.stringify(
                error.response?.data,
                null,
                2
            )
        );

    } finally {

        setLoading(false);

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
                        setFormData={setFormData}
                        archivos={archivos}
                        handleArchivos={handleArchivos}
                        archivosExistentes={archivosExistentes}
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