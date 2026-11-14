import { useEffect, useState } from "react";
import cajaService from "../Services/CajaService";
import obtenerMensajeError from "../../../utils/obtenerMensajeError";
import Swal from "sweetalert2";
import { reabrirCaja, ajustarCaja, abrirCajaDe } from "../cajaAcciones";

const soles = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

const hoy = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD en hora local

export default function CajaGeneral() {

    const [fecha, setFecha] = useState(hoy());
    const [data, setData] = useState(null);

const cargar = async () => {
    try {
        setData(await cajaService.general(fecha));
    } catch (error) {
        Swal.fire("Error", obtenerMensajeError(error, "No se pudo cargar la caja general."), "error");
    }
};

useEffect(() => { cargar(); }, [fecha]);
    
    useEffect(() => {
        const cargar = async () => {
            try {
                setData(await cajaService.general(fecha));
            } catch (error) {
                Swal.fire("Error", obtenerMensajeError(error, "No se pudo cargar la caja general."), "error");
            }
        };
        cargar();
    }, [fecha]);

    return (
        <div>

            <div className="d-flex align-items-end gap-3 mb-3">

            <div style={{ maxWidth: 220 }}>
                <label className="form-label">Fecha</label>
                <input
                    type="date"
                    className="form-control"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                />
            </div>

            <button
                className="btn btn-outline-primary"
                onClick={async () => (await abrirCajaDe()) && cargar()}
            >
                Abrir caja de un usuario
            </button>

        </div>

            {!data ? <div>Cargando...</div> : (
                <>
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <div className="card text-bg-success"><div className="card-body">
                                <small>Ingresos totales</small><h4>{soles(data.total_ingresos)}</h4>
                            </div></div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-bg-danger"><div className="card-body">
                                <small>Egresos totales</small><h4>{soles(data.total_egresos)}</h4>
                            </div></div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-bg-dark"><div className="card-body">
                                <small>Saldo general</small><h4>{soles(data.saldo)}</h4>
                            </div></div>
                        </div>
                    </div>

                    <h5>Por usuario</h5>
<div className="table-responsive mb-4">
    <table className="table align-middle">
        <thead className="table-dark">
            <tr>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Apertura</th>
                <th>Ingresos</th>
                <th>Egresos</th>
                <th>Saldo</th>
                <th>Diferencia</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {data.por_usuario.length === 0 ? (
                <tr>
                    <td colSpan="8" className="text-center">Nadie abrió caja este día</td>
                </tr>
            ) : data.por_usuario.map(u => (
                <tr key={u.caja_id}>
                    <td>{u.usuario}</td>
                    <td>
                        <span className={`badge ${u.estado === "ABIERTA" ? "bg-success" : "bg-secondary"}`}>
                            {u.estado}
                        </span>
                    </td>
                    <td>{soles(u.apertura)}</td>
                    <td>{soles(u.ingresos)}</td>
                    <td>{soles(u.egresos)}</td>
                    <td>{soles(u.saldo)}</td>
                    <td className={Number(u.diferencia) < 0 ? "text-danger" : ""}>
                        {u.diferencia === null ? "-" : soles(u.diferencia)}
                    </td>
                    <td>
                        {u.estado === "CERRADA" && (
                            <div className="d-flex gap-1">
                                <button
                                    className="btn btn-outline-dark btn-sm"
                                    onClick={async () =>
                                        (await reabrirCaja({ id: u.caja_id, fecha: u.fecha })) && cargar()
                                    }
                                >
                                    Reabrir
                                </button>
                                <button
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={async () =>
                                        (await ajustarCaja({
                                            id: u.caja_id,
                                            efectivo_esperado: u.efectivo_esperado,
                                            efectivo_contado: u.efectivo_contado,
                                        })) && cargar()
                                    }
                                >
                                    Ajustar
                                </button>
                            </div>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

                    <h5>Por método de pago</h5>
                    <div className="d-flex flex-wrap gap-2">
                        {Object.entries(data.por_metodo || {}).map(([m, v]) => (
                            <span key={m} className="badge bg-secondary p-2">
                                {m}: +{soles(v.ingresos)} / -{soles(v.egresos)}
                            </span>
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}