function ProductoTable({
    productos,
    onEditar,
    onEliminar
}) {


    return (

        <div className="table-responsive">

            <table className="table table-hover align-middle">

                <thead className="table-dark">

                    <tr>

                        <th>Código</th>

                        <th>Producto</th>

                        <th>Categoría</th>

                        <th>Rubro</th>

                        <th>Stock</th>

                        <th>Precio Venta</th>

                        <th>Estado</th>

                        <th>Acciones</th>

                    </tr>

                </thead>


                <tbody>


                    {
                        productos.length === 0 ? (

                            <tr>

                                <td 
                                    colSpan="8"
                                    className="text-center"
                                >
                                    No existen productos
                                </td>

                            </tr>


                        ) : (

                            productos.map(producto => (

                                <tr key={producto.id}>


                                    <td>
                                        {producto.codigo}
                                    </td>


                                    <td>

                                        <strong>
                                            {producto.nombre}
                                        </strong>

                                    </td>


                                    <td>

                                        {
                                            producto.categoria?.nombre
                                            ||
                                            "-"
                                        }

                                    </td>


                                    <td>

                                        <span 
                                            className={
                                                producto.tipo_rubro === "TECNOLOGIA"
                                                ?
                                                "badge bg-primary"
                                                :
                                                "badge bg-success"
                                            }
                                        >

                                            {
                                                producto.tipo_rubro
                                            }

                                        </span>

                                    </td>


                                    <td>

                                        {
                                            producto.stock_actual
                                        }

                                    </td>


                                    <td>

                                        S/
                                        {
                                            Number(
                                                producto.precio_venta
                                            ).toFixed(2)
                                        }

                                    </td>


                                    <td>

                                        {
                                            producto.activo
                                            ?

                                            <span className="badge bg-success">
                                                Activo
                                            </span>

                                            :

                                            <span className="badge bg-danger">
                                                Inactivo
                                            </span>
                                        }

                                    </td>


                                    <td>


                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() =>
                                                onEditar(producto)
                                            }
                                        >

                                            <i className="bi bi-pencil"></i>

                                        </button>


                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() =>
                                                onEliminar(producto.id)
                                            }
                                        >

                                            <i className="bi bi-trash"></i>

                                        </button>


                                    </td>


                                </tr>

                            ))

                        )
                    }


                </tbody>


            </table>


        </div>

    );

}


export default ProductoTable;