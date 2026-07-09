import { useEffect, useState } from "react";


import { createOrden, updateOrden } from "../services/ordenService";
import { subirArchivoOrden } from "../services/ordenArchivoService";

import useDetalleOrden from "./useDetalleOrden";
import useCatalogosOrden from "./useCatalogosOrden";
import { useRubro } from "../../../context/RubroContext";

import {
    safeParse,
    calcularTotal,
    limpiarPayloadOrden,
} from "../utils/OrdenHelpers";

import { ORDEN_INITIAL_STATE } from "../constants/ordenInitialState";



export default function useOrdenForm({
    orden = null,
    onSuccess,
    onClose,
}) {

    const { rubro } = useRubro();
    const [formData,setFormData] =
        useState({
            ...ORDEN_INITIAL_STATE,
            tipo_rubro: rubro
        });


    const [archivos, setArchivos] = useState([]);
    const [archivosExistentes, setArchivosExistentes] = useState([]);

    const [loading, setLoading] = useState(false);

    // ==========================
    // Detalles de la Orden
    // ==========================

    const {
        agregarServicio,
        eliminarServicio,
        actualizarServicio,
        agregarRepuesto,
        eliminarRepuesto,
        actualizarRepuesto,
    } = useDetalleOrden(setFormData);

    // ==========================
    // Cargar Orden
    // ==========================

useEffect(() => {

    if (!orden) {

        setFormData(prev => ({
            ...prev,

            tipo_rubro:rubro,

            equipo_id:"",
            vehiculo_id:"",

            detalles:[],
            repuestos:[],

            checklist_vehicular:[],
            checklist_recepcion:[],
        }));

    }

},[rubro]);

    useEffect(() => {
        if (orden) {
            setArchivosExistentes(orden.archivos || []);

            setFormData({
                ...ORDEN_INITIAL_STATE,
                ...orden,
                accesorios: safeParse(orden.accesorios),
                checklist_recepcion: safeParse(orden.checklist_recepcion),
                checklist_vehicular: safeParse(
                    orden.checklist_vehicular
                ),
            });
        } else {

            setFormData({
                ...ORDEN_INITIAL_STATE,
                tipo_rubro: rubro
            });

            setArchivosExistentes([]);

        }
    }, [orden, rubro]);
    // ==========================
    // Catálogos
    // ==========================

 const {
 clientes,
 equipos,
 vehiculos,
} = useCatalogosOrden(formData.cliente_id);

    // ==========================
    // Cambios del Formulario
    // ==========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==========================
    // Calcular Total
    // ==========================

    useEffect(() => {
        const total = calcularTotal(formData);

        if (Number(formData.total) !== total) {
            setFormData((prev) => ({
                ...prev,
                total,
            }));
        }
    }, [formData.detalles, formData.repuestos]);

    // ==========================
    // Archivos
    // ==========================

    const handleArchivos = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 2) {
            alert("Solo se permiten 2 fotos.");
            return;
        }

        setArchivos(files);
    };

    // ==========================
    // Guardar
    // ==========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const payload = limpiarPayloadOrden(formData);
            console.log("PAYLOAD:", payload);

            let response;

            if (orden) {
                response = await updateOrden(
                    orden.id,
                    payload
                );
            } else {
                response = await createOrden(payload);
            }

            const ordenCreada =
                response.data.orden || response.data;

            if (
                !orden &&
                archivos.length > 0 &&
                ordenCreada?.id
            ) {
                for (const archivo of archivos) {
                    const formDataArchivo = new FormData();

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

            if (onSuccess) {
                await onSuccess();
            }

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error(error);

            alert(
                JSON.stringify(
                    error.response?.data || error.message,
                    null,
                    2
                )
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,

        clientes,
        equipos,
        vehiculos,

        archivos,
        archivosExistentes,

        loading,

        handleChange,
        handleArchivos,
        handleSubmit,

        agregarServicio,
        eliminarServicio,
        actualizarServicio,

        agregarRepuesto,
        eliminarRepuesto,
        actualizarRepuesto,
    };
}