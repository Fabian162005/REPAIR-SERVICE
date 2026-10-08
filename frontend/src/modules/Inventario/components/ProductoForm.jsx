function ProductoForm({

    producto,
    categorias,
    onChange,
    onSubmit,
    modoEdicion

}) {

    return (

        <form onSubmit={onSubmit}>

            <div className="mb-3">

                <label>Nombre</label>

                <input
                    className="form-control"
                    name="nombre"
                    value={producto.nombre}
                    onChange={onChange}
                />

            </div>


            <div className="mb-3">

                <label>Categoría</label>

                <select
                    className="form-select"
                    name="categoria_id"
                    value={producto.categoria_id || ""}
                    onChange={onChange}
                >

                    <option value="">Seleccionar</option>

                    {
                        categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </option>
                        ))
                    }

                </select>

            </div>


            <div className="row">

                <div className="col">

                    <label>Precio Compra</label>

                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="precio_compra"
                        value={producto.precio_compra}
                        onChange={onChange}
                    />

                </div>

                <div className="col">

                    <label>Precio Venta</label>

                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="precio_venta"
                        value={producto.precio_venta}
                        onChange={onChange}
                    />

                </div>

            </div>


            <div className="row mt-3">

                <div className="col">

                    <label>
                        Stock Actual
                        {modoEdicion && (
                            <small className="text-muted"> (usa Entrada/Salida)</small>
                        )}
                    </label>

                    <input
                        type="number"
                        className="form-control"
                        name="stock_actual"
                        value={producto.stock_actual}
                        onChange={onChange}
                        disabled={modoEdicion}
                    />

                </div>

                <div className="col">

                    <label>Stock Mínimo</label>

                    <input
                        type="number"
                        className="form-control"
                        name="stock_minimo"
                        value={producto.stock_minimo}
                        onChange={onChange}
                    />

                </div>

            </div>


            <div className="mt-3">

                <label>Unidad de medida</label>

                <select
                    className="form-select"
                    name="unidad_medida"
                    value={producto.unidad_medida || "Unidad"}
                    onChange={onChange}
                >
                    <option value="Unidad">Unidad</option>
                    <option value="Litro">Litro</option>
                    <option value="Galón">Galón</option>
                    <option value="Kilo">Kilo</option>
                    <option value="Metro">Metro</option>
                    <option value="Juego">Juego</option>
                    <option value="Caja">Caja</option>
                </select>

            </div>


            <div className="mt-3">

                <button className="btn btn-primary">
                    {
                        modoEdicion
                            ? "Actualizar Producto"
                            : "Guardar Producto"
                    }
                </button>

            </div>

        </form>

    );

}


export default ProductoForm;