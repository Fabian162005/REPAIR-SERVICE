import { create } from "zustand";


const productoStore = create((set)=>({

    productos: [],

    productoSeleccionado:null,

    loading:false,


    setProductos:(productos)=>
        set({
            productos
        }),


    setProductoSeleccionado:(producto)=>
        set({
            productoSeleccionado:producto
        }),


    setLoading:(estado)=>
        set({
            loading:estado
        }),


    limpiarProducto:()=>
        set({
            productoSeleccionado:null
        })


}));


export default productoStore;