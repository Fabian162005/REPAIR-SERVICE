import {
    Container,
    Card,
    Button,
} from "react-bootstrap";

import {
    useEffect,
    useState,
} from "react";

import EquipoTable from "../components/EquipoTable";

import EquipoModal from "../components/EquipoModal";

import {
    getEquipos,
    deleteEquipo,
} from "../services/equipoService";

export default function EquiposPage() {

    const [equipos, setEquipos] =
        useState([]);

    const [showModal, setShowModal] =
        useState(false);

    const [equipoEditar,
        setEquipoEditar] =
        useState(null);

    useEffect(() => {

        cargarEquipos();

    }, []);

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

    const handleNuevo = () => {

        setEquipoEditar(null);

        setShowModal(true);
    };

    const handleEditar =
        (equipo) => {

            setEquipoEditar(
                equipo
            );

            setShowModal(true);
        };

    const handleEliminar =
        async (id) => {

            if (
                !window.confirm(
                    "¿Eliminar equipo?"
                )
            ) {
                return;
            }

            try {

                await deleteEquipo(id);

                cargarEquipos();

            } catch (error) {

                console.error(error);

            }
        };

    return (

        <Container fluid>

            <Card>

                <Card.Header
                    className="d-flex justify-content-between align-items-center"
                >

                    <h4 className="mb-0">
                        Equipos
                    </h4>

                    <Button
                        onClick={
                            handleNuevo
                        }
                    >
                        Nuevo Equipo
                    </Button>

                </Card.Header>

                <Card.Body>

                    <EquipoTable
                        equipos={
                            equipos
                        }
                        onEdit={
                            handleEditar
                        }
                        onDelete={
                            handleEliminar
                        }
                    />

                </Card.Body>

            </Card>

            <EquipoModal
                show={
                    showModal
                }
                handleClose={() =>
                    setShowModal(
                        false
                    )
                }
                equipo={
                    equipoEditar
                }
                onSuccess={
                    cargarEquipos
                }
            />

        </Container>

    );
}