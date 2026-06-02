import { Table, Button } from "react-bootstrap";

export default function EquipoTable({
    equipos,
    onEdit,
    onDelete,
}) {
    return (
        <Table
            striped
            bordered
            hover
            responsive
        >
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Serie</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>

                {equipos.length === 0 && (
                    <tr>
                        <td
                            colSpan="7"
                            className="text-center"
                        >
                            No hay equipos
                        </td>
                    </tr>
                )}

                {equipos.map((equipo) => (

                    <tr key={equipo.id}>

                        <td>{equipo.id}</td>

                        <td>

                            {equipo.cliente?.razon_social ||

                                `${equipo.cliente?.nombres || ""}
                                 ${equipo.cliente?.apellidos || ""}`}

                        </td>

                        <td>
                            {equipo.tipo_equipo}
                        </td>

                        <td>
                            {equipo.marca}
                        </td>

                        <td>
                            {equipo.modelo}
                        </td>

                        <td>
                            {equipo.numero_serie}
                        </td>

                        <td>

                            <Button
                                size="sm"
                                variant="warning"
                                className="me-2"
                                onClick={() =>
                                    onEdit(equipo)
                                }
                            >
                                Editar
                            </Button>

                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() =>
                                    onDelete(equipo.id)
                                }
                            >
                                Eliminar
                            </Button>

                        </td>

                    </tr>

                ))}

            </tbody>
        </Table>
    );
}