import api from "../../../api/axios";

export const getVehiculos = () =>
    api.get("/vehiculos");

export const createVehiculo = (data) =>
    api.post("/vehiculos", data);

export const updateVehiculo = (id, data) =>
    api.put(`/vehiculos/${id}`, data);

export const deleteVehiculo = (id) =>
    api.delete(`/vehiculos/${id}`);