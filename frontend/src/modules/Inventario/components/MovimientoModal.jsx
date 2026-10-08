import { useState } from "react";
import Swal from "sweetalert2";
import productoService from "../services/productoService";

const MOTIVOS = {
    ENTRADA: ["COMPRA", "DEVOLUCION", "AJUSTE POSITIVO"],
    SALIDA: ["VENTA", "MERMA", "AJUSTE NEGATIVO"],
};

const formInicial = {
    tipo_movimiento: "ENTRADA",
    cantidad: "",
    motivo: "COMPRA",
    observaciones: ""
};

function MovimientoModal({ mostrar, cerrar, producto, onGuardado }) {

    const [form, setForm] = useState(formInicial);
    const [guardando, setGuardando] = useState(false);

    if (!mostrar || !producto) return null;

    const cambiar = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === "tipo_movimiento" && { motivo: MOTIVOS[value][0] })
        }));
    };

    const cerrarModal = () => {
        setForm(formInicial);
        cerrar();
    };

    const guardar = async (e) => {
        e.preventDefault();

        try {
            setGuardando(true);

            const data = await productoService.registrarMovimiento(
                producto.id,
                { ...form, cantidad: Number(form.cantidad) }
            );

            await Swal.fire("Listo", data.message, "success");

            onGuardado();
            cerrarModal();

        } catch (err) {
            const errores = err.response?.data?.errors;

            Swal.fire(
                "Error",
                errores
                    ? Object.values(errores).flat().join("\n")
                    : err.response?.data?.message || "No se pudo registrar el movimiento.",
                "error"
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5>
                            {producto.nombre}
                            <small className="text-muted"> (stock: {producto.stock_actual})</small>
                        </h5>
                        <button className="btn-close" onClick={cerrarModal} />
                    </div>

                    <form onSubmit={guardar}>
                        <div className="modal-body">

                            <div className="mb-3">
                                <label>Tipo</label>
                                <select
                                    className="form-select"
                                    name="tipo_movimiento"
                                    value={form.tipo_movimiento}
                                    onChange={cambiar}
                                >
                                    <option value="ENTRADA">Entrada</option>
                                    <option value="SALIDA">Salida</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Cantidad</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    name="cantidad"
                                    value={form.cantidad}
                                    onChange={cambiar}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label>Motivo</label>
                                <select
                                    className="form-select"
                                    name="motivo"
                                    value={form.motivo}
                                    onChange={cambiar}
                                >
                                    {MOTIVOS[form.tipo_movimiento].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Observaciones</label>
                                <textarea
                                    className="form-control"
                                    name="observaciones"
                                    value={form.observaciones}
                                    onChange={cambiar}
                                />
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" disabled={guardando}>
                                {guardando ? "Guardando..." : "Registrar"}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default MovimientoModal;