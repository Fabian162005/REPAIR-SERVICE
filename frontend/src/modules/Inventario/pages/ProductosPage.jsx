import { useEffect, useState } from "react";

import productoService from "../services/productoService";

import productoStore from "../store/productoStore";

import { useRubro } from "../../../context/RubroContext";

import ProductoTable from "../components/ProductoTable";
import ProductoFilters from "../components/ProductoFilters";
import ProductoModal from "../components/ProductoModal";

import categoriaService 
from "../services/categoriaService";

function ProductosPage(){


    const {
    productos = [],
    setProductos,
    loading,
    setLoading
} = productoStore();


    const { rubro } = useRubro();



    const [buscar,setBuscar] = useState("");

    const [mostrarModal,setMostrarModal] =
        useState(false);

        const [modoEdicion,setModoEdicion] =
    useState(false);

    const [categorias,setCategorias] =
     useState([]);





 const productoInicial = {

    id:null,

    nombre:"",

    descripcion:"",

    categoria_id:"",

    precio_compra:0,

    precio_venta:0,

    stock_actual:0,

    stock_minimo:0,

    unidad_medida:"Unidad",

    codigo_barras:null,

    activo:true

};


const [producto,setProducto] =
useState(productoInicial);

const categoriasFiltradas = (categorias || []).filter(categoria => {
    // Si estamos editando
    // mostramos también la categoría actual
    if(modoEdicion){

        return (
            categoria.tipo_rubro === rubro ||
            categoria.id == producto.categoria_id
        );

    }


    // Si es nuevo producto
    // solo categorías del rubro actual

    return categoria.tipo_rubro === rubro;

});

    // CARGAR PRODUCTOS

    const cargarProductos = async()=>{

        try{

            setLoading(true);


            const data =
                await productoService.listarProductos();


            setProductos(data);


        }catch(error){

            console.error(error);

        }
        finally{

            setLoading(false);

        }

    };



    useEffect(()=>{

        cargarProductos();

        cargarCategorias();


    },[]);

const cargarCategorias = async()=>{

    try{

        const data =
            await categoriaService.listarCategorias();


        console.log("CATEGORIAS FRONT:", data);


        setCategorias(
            Array.isArray(data)
            ? data
            : []
        );


    }catch(error){

        console.error(
            "Error cargando categorias:",
            error
        );

        setCategorias([]);

    }

};





    // FILTRO POR RUBRO Y BUSQUEDA

    const productosFiltrados =
    (productos || []).filter(producto=>{


        const coincideRubro =
            producto.categoria?.tipo_rubro === rubro;


        const coincideBusqueda =
            producto.nombre
            .toLowerCase()
            .includes(
                buscar.toLowerCase()
            );


        return coincideRubro &&
               coincideBusqueda;


    });






    const manejarCambio=(e)=>{


        setProducto({

            ...producto,

            [e.target.name]:
                e.target.value

        });


    };





   const guardarProducto=async(e)=>{

    e.preventDefault();

    try{

        if(modoEdicion){

            await productoService.actualizarProducto(
                producto.id,
                producto
            );

        }else{

            await productoService.crearProducto(
                producto
            );

        }

        setMostrarModal(false);
        setModoEdicion(false);
        setProducto(productoInicial);

        cargarProductos();


    }catch(error){

        console.error(
            "ERROR BACKEND:",
            error.response?.data
        );

    }

};




    const eliminarProducto=async(id)=>{


        if(
            !confirm(
                "¿Deseas desactivar este producto?"
            )
        )
        return;



        try{


            await productoService.eliminarProducto(id);


            cargarProductos();


        }catch(error){

            console.error(error);

        }


    };


const editarProducto = (productoEditar)=>{


    setProducto({

        id: productoEditar.id,

        nombre: productoEditar.nombre,

        descripcion: productoEditar.descripcion || "",

        categoria_id: productoEditar.categoria_id,

        categoria: productoEditar.categoria,

        precio_compra: productoEditar.precio_compra,

        precio_venta: productoEditar.precio_venta,

        stock_actual: productoEditar.stock_actual,

        stock_minimo: productoEditar.stock_minimo,

        unidad_medida: productoEditar.unidad_medida,

        codigo_barras: productoEditar.codigo_barras || "",

        activo: productoEditar.activo


    });


    setModoEdicion(true);

    setMostrarModal(true);

};


    return (

        <div>


            <div className="d-flex justify-content-between align-items-center mb-4">


                <div>


                    <h2>

                        Inventario

                    </h2>


                    <p className="text-muted">

                        Productos 
                        -
                        {rubro}

                    </p>


                </div>



                <button

                    className="btn btn-primary"

                    onClick={()=>{

                        setProducto(productoInicial);

                        setModoEdicion(false);

                        setMostrarModal(true);

                    }}
                >

                    <i className="bi bi-plus-circle"></i>

                    Nuevo Producto


                </button>


            </div>





            <ProductoFilters

                buscar={buscar}

                setBuscar={setBuscar}

            />






            {
                loading ?

                (

                    <div className="text-center">

                        Cargando productos...

                    </div>

                )

                :

                (

                    <ProductoTable

                        productos={
                            productosFiltrados
                        }

                        onEditar={
                            editarProducto
                        }

                        onEliminar={
                            eliminarProducto
                        }

                    />

                )

            }







            <ProductoModal

                mostrar={mostrarModal}

                cerrar={()=>{
                    setMostrarModal(false);
                    setModoEdicion(false);
                }}

                producto={producto}

                categorias={categoriasFiltradas}

                modoEdicion={modoEdicion}

                onChange={manejarCambio}

                onSubmit={guardarProducto}

            />



        </div>


    );


}


export default ProductosPage;