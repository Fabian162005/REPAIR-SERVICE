import api from "../../../api/axios";

const configService = {

    async negocio() {
        return (await api.get("/negocio")).data.data;
    },

    async guardarNegocio(data) {
        return (await api.put("/negocio", data)).data;
    },

    async subirLogo(archivo) {
        const form = new FormData();
        form.append("logo", archivo);

        return (await api.post("/negocio/logo", form, {
            headers: { "Content-Type": "multipart/form-data" },
        })).data;
    },

    async perfil() {
        return (await api.get("/perfil")).data.data;
    },

    async guardarPerfil(data) {
        return (await api.put("/perfil", data)).data;
    },

    async cambiarPassword(data) {
        return (await api.put("/perfil/password", data)).data;
    },

    async plan() {
        return (await api.get("/plan")).data.data;
    },
};

export default configService;