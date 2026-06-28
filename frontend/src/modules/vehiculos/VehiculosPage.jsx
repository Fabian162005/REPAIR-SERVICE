import { useEffect, useState } from "react";
import api from "../../api/axios";
import VehiculoModal from "./components/VehiculoModal";
import EliminarVehiculoModal from "./components/EliminarVehiculoModal";

import {
getVehiculos
} from "./services/vehiculoService";

function VehiculosPage() {

    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(true);


    const [showModal,setShowModal]=
    useState(false);

    const [showEliminar,setShowEliminar]=
    useState(false);

    const [vehiculoEditar,setVehiculoEditar]=
    useState(null);

    const [vehiculoEliminar,setVehiculoEliminar]=
    useState(null);

    const cargarVehiculos = async () => {

        try {

            setLoading(true);

            const res =
            await getVehiculos();

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

                    <button
                    className="btn btn-success mb-4 me-5"

                    onClick={()=>{

                    setVehiculoEditar(null);

                    setShowModal(true);

                    }}

                    >

                    Nuevo Vehículo

                    </button>
                                        

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
                                <th>Acciones</th>

                               
                            </tr>

                        </thead>

                        <tbody>

                            {vehiculos.map((v) => (

                                <tr key={v.id}>

                                    <td>{v.placa}</td>

                                    <td>{`${v.cliente?.nombres || ""} ${v.cliente?.apellidos || ""}`}</td>

                                    <td>{v.marca}</td>

                                    <td>{v.modelo}</td>

                                    <td>{v.anio || "-"}</td>

                                    <td>{v.tipo_vehiculo}</td>

                                    <td>{v.combustible || "-"}</td>

                                    <td>

                                                                    <button
                                                                    className="btn btn-warning btn-sm me-2"

                                                                    onClick={()=>{

                                                                    setVehiculoEditar(v);

                                                                    setShowModal(true);

                                                                    }}

                                                                    >

                                                                    Editar

                                                                    </button>

                                                                    <button
                                                                    className="btn btn-danger btn-sm"

                                                                    onClick={()=>{

                                                                    setVehiculoEliminar(v);

                                                                    setShowEliminar(true);

                                                                    }}

                                                                    >

                                                                    Eliminar

                                                                    </button>

                                                                    </td>
                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <VehiculoModal

                    show={showModal}

                    handleClose={()=>
                    setShowModal(false)
                    }

                    vehiculo={
                    vehiculoEditar
                    }

                    onSuccess={
                    cargarVehiculos
                    }

                    />

                    <EliminarVehiculoModal

                    show={showEliminar}

                    handleClose={()=>
                    setShowEliminar(false)
                    }

                    vehiculo={
                    vehiculoEliminar
                    }

                    onSuccess={
                    cargarVehiculos
                    }

                    />

                </div>

            )}

        </div>

    );
    

}



export default VehiculosPage;