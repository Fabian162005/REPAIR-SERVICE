import { useEffect, useState } from "react";
import productoService from "../services/productoService";

function MovimientosPanel({ mostrar, cerrar, producto }) {

    const [movs, setMovs] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (!mostrar || !producto) return;

        const cargar = async () => {
            try {
                setCargando(true);
                setMovs(await productoService.listarMovimientos(producto.id));
            } catch (error) {
                console.error(error);
                setMovs([]);
            } finally {
                setCargando(false);
            }
        };

        cargar();
    }, [mostrar, producto]);

    if (!mostrar || !producto) return null;

    return (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5>Kardex: {producto.codigo} - {producto.nombre}</h5>
                        <button className="btn-close" onClick={cerrar} />
                    </div>

                    <div className="modal-body table-responsive">
                        {cargando ? (
                            <div className="text-center">Cargando movimientos...</div>
                        ) : (
                            <table className="table table-sm align-middle">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Tipo</th>
                                        <th>Cant.</th>
                                        <th>Stock</th>
                                        <th>Motivo</th>
                                        <th>Referencia</th>
                                        <th>Usuario</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movs.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center">Sin movimientos</td>
                                        </tr>
                                    ) : movs.map(m => (
                                        <tr key={m.id}>
                                            <td>{m.fecha}</td>
                                            <td>
                                                <span className={`badge ${m.tipo_movimiento === "ENTRADA" ? "bg-success" : "bg-danger"}`}>
                                                    {m.tipo_movimiento}
                                                </span>
                                            </td>
                                            <td>{m.cantidad}</td>
                                            <td>{m.stock_anterior} → {m.stock_nuevo}</td>
                                            <td>{m.motivo}</td>
                                            <td>
                                                {m.referencia_tipo
                                                    ? `${m.referencia_tipo}${m.observaciones && m.referencia_tipo === "ORDEN" ? " " + m.observaciones : ""}`
                                                    : "-"}
                                            </td>
                                            <td>{m.usuario || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MovimientosPanel;