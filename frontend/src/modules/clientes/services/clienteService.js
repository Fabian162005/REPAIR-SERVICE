import api from "../../../api/axios";

export const crearCliente = (data) =>
  api.post("/clientes", data);

export const actualizarCliente = (id, data) =>
  api.put(`/clientes/${id}`, data);

export const eliminarCliente = (id) =>
  api.delete(`/clientes/${id}`);

export const obtenerClientes = () =>
  api.get("/clientes");