import { useState } from "react";

const METODOS = ["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA", "OTROS"];

const formatearFecha = (f) =>
    f ? new Date(f).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" }) : "-";

export default function MovimientosCajaTable({ movimientos, puedeAnular, cajaAbierta, onAnular }) {

    const [tipo, setTipo] = useState("");
    const [metodo, setMetodo] = useState("");

    const filtrados = movimientos.filter(m =>
        (!tipo || m.tipo_movimiento === tipo) &&
        (!metodo || m.metodo_pago === metodo)
    );

    return (
        <>
            <div className="row mb-3">
                <div className="col-md-3">
                    <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)}>
                        <option value="">Todos los tipos</option>
                        <option value="INGRESO">Ingresos</option>
                        <option value="EGRESO">Egresos</option>
                    </select>
                </div>

                <div className="col-md-3">
                    <select className="form-select" value={metodo} onChange={e => setMetodo(e.target.value)}>
                        <option value="">Todos los métodos</option>
                        {METODOS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Hora</th>
                            <th>Tipo</th>
                            <th>Origen</th>
                            <th>Descripción</th>
                            <th>Método</th>
                            <th>Monto</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtrados.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">Sin movimientos</td>
                            </tr>
                        ) : filtrados.map(m => (
                            <tr key={m.id} className={m.anulado ? "text-decoration-line-through text-muted" : ""}>
                                <td>{formatearFecha(m.fecha_movimiento)}</td>
                                <td>
                                    <span className={`badge ${m.tipo_movimiento === "INGRESO" ? "bg-success" : "bg-danger"}`}>
                                        {m.tipo_movimiento}
                                    </span>
                                </td>
                                <td>{m.origen.replace("_", " ")}</td>
                                <td>{m.descripcion}</td>
                                <td>{m.metodo_pago}</td>
                                <td>S/ {Number(m.monto).toFixed(2)}</td>
                                <td>
                                    {puedeAnular && cajaAbierta && !m.anulado && m.origen === "GASTO_MANUAL" && (
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            title="Anular egreso"
                                            onClick={() => onAnular(m)}
                                        >
                                            <i className="bi bi-x-circle"></i>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}