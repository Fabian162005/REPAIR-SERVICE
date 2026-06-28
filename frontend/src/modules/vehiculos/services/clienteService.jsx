import api from "../../../api/axios";

export const getClientes = () =>
    api.get("/clientes");