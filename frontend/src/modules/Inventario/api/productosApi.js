import api from "../../../api/axios";


const productosApi = {

    getAll: () => {
        return api.get("/productos");
    },


    getById: (id) => {
        return api.get(`/productos/${id}`);
    },


    create: (data) => {
        return api.post("/productos", data);
    },


    update: (id, data) => {
        return api.put(`/productos/${id}`, data);
    },


    remove: (id) => {
        return api.delete(`/productos/${id}`);
    }

};


export default productosApi;