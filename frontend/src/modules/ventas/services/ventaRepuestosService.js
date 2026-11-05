import api from "../../../api/axios";

const ventaRepuestoService = {

    async listar(tipoRubro) {
        const r = await api.get("/ventas-repuesto", { params: { tipo_rubro: tipoRubro } });
        return r.data.data;
    },

    async crear(data) {
        const r = await api.post("/ventas-repuesto", data);
        return r.data;
    },

    async anular(id) {
        const r = await api.post(`/ventas-repuesto/${id}/anular`);
        return r.data;
    }

};

export default ventaRepuestoService;