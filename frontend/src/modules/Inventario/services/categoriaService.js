import categoriasApi from "../api/categoriasApi";


const categoriaService = {


    async listarCategorias(){

    try{

        const response =
            await categoriasApi.getAll();


        console.log(
            "RESPUESTA API CATEGORIAS:",
            response.data
        );


return response.data;

    }catch(error){

        console.error(
            "Error cargando categorias",
            error
        );

        throw error;

    }

},


    async crearCategoria(data){

        const response =
            await categoriasApi.create(data);


        return response.data;

    },


    async actualizarCategoria(id,data){

        const response =
            await categoriasApi.update(
                id,
                data
            );


        return response.data;

    },


    async eliminarCategoria(id){

        const response =
            await categoriasApi.remove(id);


        return response.data;

    }


};


export default categoriaService;