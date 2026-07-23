function ProductoFilters({
    buscar,
    setBuscar
}) {


    return (

        <div className="mb-3">


            <input

                type="text"

                className="form-control"

                placeholder="Buscar producto..."

                value={buscar}

                onChange={(e)=>
                    setBuscar(e.target.value)
                }

            />


        </div>

    );


}


export default ProductoFilters;