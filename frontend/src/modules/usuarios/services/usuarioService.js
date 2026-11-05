import api from "../../../api/axios";

const usuarioService = {

    async listar(soloActivos = false) {
        const r = await api.get("/usuarios", {
            params: { activos: soloActivos ? 1 : 0 },
        });
        return r.data.data;
    },

    async crear(data) {
        return (await api.post("/usuarios", data)).data;
    },

    async actualizar(id, data) {
        return (await api.put(`/usuarios/${id}`, data)).data;
    },

    async resetPassword(id, password) {
        return (await api.put(`/usuarios/${id}/password`, { password })).data;
    },

};

export default usuarioService;