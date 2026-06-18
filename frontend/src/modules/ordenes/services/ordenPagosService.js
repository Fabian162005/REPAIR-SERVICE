import axios from "axios";

const API_URL =
    "http://127.0.0.1:8000/api/orden-pagos";

export const registrarPago = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.log("ERROR BACKEND:", error.response?.data);
        throw error;
    }
};

export const obtenerPagos =
    async (ordenId) => {

        const response =
            await axios.get(
                `${API_URL}/${ordenId}`
            );

        return response.data;
    };

export const eliminarPago =
    async (id) => {

        const response =
            await axios.delete(
                `${API_URL}/${id}`
            );

        return response.data;
    };