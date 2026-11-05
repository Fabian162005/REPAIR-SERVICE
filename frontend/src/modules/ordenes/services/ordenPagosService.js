import api from "../../../api/axios";

export const registrarPago = async (data) => {
    try {
        const response = await api.post("/orden-pagos", data);
        return response.data;
    } catch (error) {
        console.log("ERROR BACKEND:", error.response?.data);
        throw error;
    }
};

export const obtenerPagos = async (ordenId) => {
    const response = await api.get(`/orden-pagos/${ordenId}`);
    return response.data;
};

export const eliminarPago = async (id, clave = null) => {
    const response = await api.delete(`/orden-pagos/${id}`, {
        data: clave ? { clave_permiso: clave } : {},
    });
    return response.data;
};
