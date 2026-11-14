import api from "../../../api/axios";

const cajaService = {

    async actual() {
        const r = await api.get("/caja/actual");
        return r.data.data;
    },

    async abrir(data) {
        const r = await api.post("/caja/abrir", data);
        return r.data;
    },

    async cerrar(data) {
        const r = await api.post("/caja/cerrar", data);
        return r.data;
    },

    async egreso(data) {
        const r = await api.post("/caja/egresos", data);
        return r.data;
    },

    async anularMovimiento(id) {
        const r = await api.delete(`/caja/movimientos/${id}`);
        return r.data;
    },

    async general(fecha) {
        const r = await api.get("/caja/general", { params: { fecha } });
        return r.data.data;
    },

    async cambiarPin(data) {
        const r = await api.put("/caja/pin", data);
        return r.data;
    },

    async estadoPin() {
        const r = await api.get("/caja/pin/estado");
        return r.data.data;
    },

    async reabrir(id, data) {
    const r = await api.post(`/caja/${id}/reabrir`, data);
    return r.data;
    },

    async ajustar(id, data) {
        const r = await api.post(`/caja/${id}/ajustar`, data);
        return r.data;
    },

};

export default cajaService;