import api from "../../../api/axios";

export const getOrdenes = (buscar = "") =>
    api.get(`/ordenes-servicio?buscar=${buscar}`);

export const getOrden = (id) =>
    api.get(`/ordenes-servicio/${id}`);

export const createOrden = (data) =>
    api.post("/ordenes-servicio", data);

export const updateOrden = (id, data) =>
    api.put(`/ordenes-servicio/${id}`, data);

export const deleteOrden = (id) =>
    api.delete(`/ordenes-servicio/${id}`);