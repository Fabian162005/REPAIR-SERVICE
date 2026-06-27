import { useEffect, useState } from "react";
import api from "../../api/axios";

function VehiculosPage() {

    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarVehiculos = async () => {

        try {

            setLoading(true);

            const res = await api.get("/vehiculos");

            setVehiculos(res.data);

        } catch (error) {

            console.error("Error cargando vehículos:", error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        cargarVehiculos();

    }, []);

    return (

        <div className="p-4">

            <h3 className="mb-4">
                Vehículos
            </h3>

            {loading && <p>Cargando...</p>}

            {!loading && vehiculos.length === 0 && (
                <p>No hay vehículos registrados.</p>
            )}

            {!loading && vehiculos.length > 0 && (

                <div className="table-responsive">

                    <table className="table table-hover">

                        <thead className="table-dark">

                            <tr>

                                <th>Placa</th>
                                <th>Cliente</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Año</th>
                                <th>Tipo</th>
                                <th>Combustible</th>

                            </tr>

                        </thead>

                        <tbody>

                            {vehiculos.map((v) => (

                                <tr key={v.id}>

                                    <td>{v.placa}</td>

                                    <td>{v.cliente?.nombre}</td>

                                    <td>{v.marca}</td>

                                    <td>{v.modelo}</td>

                                    <td>{v.anio || "-"}</td>

                                    <td>{v.tipo_vehiculo}</td>

                                    <td>{v.combustible || "-"}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}

export default VehiculosPage;