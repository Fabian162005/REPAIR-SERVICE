import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/clientes";

export const obtenerClientes = async (buscar = "") => {
    const response = await axios.get(`${API_URL}?buscar=${buscar}`);
    return response.data;
};

export const crearCliente = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

export const obtenerCliente = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const actualizarCliente = async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

export const eliminarCliente = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};