const soles = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

export default function CajaResumen({ resumen }) {

    const metodos = Object.entries(resumen.por_metodo || {});

    return (
        <>
            <div className="row mb-3">

                <div className="col-md-3">
                    <div className="card text-bg-light">
                        <div className="card-body">
                            <small className="text-muted">Apertura</small>
                            <h4>{soles(resumen.monto_apertura)}</h4>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-bg-success">
                        <div className="card-body">
                            <small>Ingresos</small>
                            <h4>{soles(resumen.total_ingresos)}</h4>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-bg-danger">
                        <div className="card-body">
                            <small>Egresos</small>
                            <h4>{soles(resumen.total_egresos)}</h4>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-bg-dark">
                        <div className="card-body">
                            <small>Saldo</small>
                            <h4>{soles(resumen.saldo)}</h4>
                        </div>
                    </div>
                </div>

            </div>

            {metodos.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                    {metodos.map(([metodo, v]) => (
                        <span key={metodo} className="badge bg-secondary p-2">
                            {metodo}: +{soles(v.ingresos)} / -{soles(v.egresos)}
                        </span>
                    ))}
                </div>
            )}

            {Object.entries(resumen.por_rubro || {}).length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                    {Object.entries(resumen.por_rubro).map(([rubro, v]) => (
                        <span key={rubro} className="badge bg-primary p-2">
                            {rubro}: +{soles(v.ingresos)} / -{soles(v.egresos)}
                        </span>
                    ))}
                </div>
            )}
        </>
    );
}