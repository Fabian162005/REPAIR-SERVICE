import ProductoForm from "./ProductoForm";


function ProductoModal({

    mostrar,
    cerrar,
    producto,
    categorias,
    onChange,
    onSubmit,
    modoEdicion

}) {


    if(!mostrar)
        return null;



    return (

        <div 
            className="modal show d-block"
            style={{
                background:"rgba(0,0,0,.5)"
            }}
        >


            <div className="modal-dialog">


                <div className="modal-content">


                    <div className="modal-header">


                        <h5>

                            {
                                modoEdicion
                                ? "Editar Producto"
                                : "Nuevo Producto"
                            }

                        </h5>


                        <button

                            className="btn-close"

                            onClick={cerrar}

                        />


                    </div>



                    <div className="modal-body">


                        <ProductoForm

                            producto={producto || {}}

                            categorias={categorias || []}

                            onChange={onChange}

                            onSubmit={onSubmit}

                            modoEdicion={modoEdicion}

                        />


                    </div>


                </div>


            </div>


        </div>

    );
}


export default ProductoModal;