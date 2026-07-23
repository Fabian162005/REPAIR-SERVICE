import api from "../../../api/axios";


const categoriasApi = {


    getAll:()=>{

        return api.get("/categorias-producto");

    },


    getById:(id)=>{

        return api.get(
            `/categorias-producto/${id}`
        );

    },


    create:(data)=>{

        return api.post(
            "/categorias-producto",
            data
        );

    },


    update:(id,data)=>{

        return api.put(
            `/categorias-producto/${id}`,
            data
        );

    },


    remove:(id)=>{

        return api.delete(
            `/categorias-producto/${id}`
        );

    }


};


export default categoriasApi;