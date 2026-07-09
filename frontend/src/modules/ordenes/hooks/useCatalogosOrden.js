import { useEffect, useState } from "react";

import { obtenerClientes } from "../../clientes/services/clienteService";
import { getEquipos } from "../../equipos/services/equipoService";
import { getVehiculos } from "../../vehiculos/services/vehiculoService";


export default function useCatalogosOrden(cliente_id){

    const [clientes,setClientes] = useState([]);

    const [equipos,setEquipos] = useState([]);

    const [vehiculos,setVehiculos] = useState([]);



    const cargarClientes = async () => {
        try {

            const response = await obtenerClientes();

            setClientes(
                response.data.data
            );

        } catch(error) {

            console.error(error);
            setClientes([]);

        }
    };



    const cargarEquipos = async () => {
        try {

            const response = await getEquipos();

            console.log(
                "RESPUESTA EQUIPOS:",
                response.data
            );

            setEquipos(
                response.data.data
            );

        } catch(error) {

            console.error(error);
            setEquipos([]);

        }
    };



    const cargarVehiculos = async () => {
    try {

        const response =
            await getVehiculos(cliente_id);


        setVehiculos(
            response.data.data
        );

    } catch(error) {

        console.error(error);

        setVehiculos([]);

    }
};



    useEffect(()=>{

    cargarClientes();

    cargarEquipos();

},[]);


useEffect(()=>{

    cargarVehiculos();

},[cliente_id]);


    return {
        clientes,
        equipos,
        vehiculos
    };

}