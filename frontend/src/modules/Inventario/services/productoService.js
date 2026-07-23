import productosApi from "../api/productosApi";


const productoService = {


    async listarProductos(){

        try {

            const response = await productosApi.getAll();

            return response.data.data;

        } catch(error){

            console.error(
                "Error cargando productos:",
                error
            );

            throw error;

        }

    },


    async obtenerProducto(id){

        try {

            const response =
                await productosApi.getById(id);


            return response.data.data;


        }catch(error){

            console.error(
                "Error obteniendo producto:",
                error
            );

            throw error;

        }

    },


    async crearProducto(data){

        try {

            const response =
                await productosApi.create(data);


            return response.data;


        }catch(error){

            console.error(
                "Error creando producto:",
                error
            );

            throw error;

        }

    },


    async actualizarProducto(id,data){

        try {

            const response =
                await productosApi.update(
                    id,
                    data
                );


            return response.data;


        }catch(error){

            console.error(
                "Error actualizando producto:",
                error
            );

            throw error;

        }

    },


    async eliminarProducto(id){

        try {

            const response =
                await productosApi.remove(id);


            return response.data;


        }catch(error){

            console.error(
                "Error eliminando producto:",
                error
            );

            throw error;

        }

    }


};


export default productoService;