import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { useRubro } from "../../../context/RubroContext";
import useAuthStore from "../../../store/authStore";
import productoService from "../../Inventario/services/productoService";
import ventaRepuestoService from "../services/ventaRepuestosService";
import obtenerMensajeError from "../../../utils/obtenerMensajeError";

const METODOS = ["EFECTIVO", "YAPE", "PLIN", "TARJETA", "TRANSFERENCIA", "OTROS"];

const soles = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

export default function VentasRepuestoPage() {

    const { rubro } = useRubro();
    const esAdmin = useAuthStore((s) => s.user?.rol) === "ADMIN";

    const [productos, setProductos] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [items, setItems] = useState([]);
    const [metodo, setMetodo] = useState("EFECTIVO");
    const [observaciones, setObservaciones] = useState("");
    const [guardando, setGuardando] = useState(false);

    const cargar = async () => {
        try {
            const [prods, vts] = await Promise.all([
                productoService.listarProductos(),
                ventaRepuestoService.listar(rubro),
            ]);

            setProductos(prods.filter(p => p.categoria?.tipo_rubro === rubro && p.stock_actual > 0));
            setVentas(vts);
        } catch (error) {
            Swal.fire("Error", obtenerMensajeError(error, "No se pudo cargar la información."), "error");
        }
    };

    useEffect(() => {
        setItems([]);
        cargar();
    }, [rubro]);

    const usados = items.map(i => i.producto_id);

    const agregar = () => setItems([...items, { producto_id: "", cantidad: 1, precio_unitario: 0 }]);

    const quitar = (idx) => setItems(items.filter((_, i) => i !== idx));

    const elegir = (idx, id) => {
        const p = productos.find(x => x.id === Number(id));
        const nuevos = [...items];

        nuevos[idx] = p
            ? { producto_id: p.id, cantidad: 1, precio_unitario: p.precio_venta }
            : { producto_id: "", cantidad: 1, precio_unitario: 0 };

        setItems(nuevos);
    };

    const cambiarCantidad = (idx, valor) => {
        const item = items[idx];
        const p = productos.find(x => x.id === item.producto_id);

        let cantidad = Math.max(1, parseInt(valor) || 1);

        if (p && cantidad > p.stock_actual) {
            cantidad = p.stock_actual;
            Swal.fire("Stock insuficiente", `Solo hay ${p.stock_actual} de "${p.nombre}".`, "warning");
        }

        const nuevos = [...items];
        nuevos[idx] = { ...item, cantidad };
        setItems(nuevos);
    };

    const cambiarPrecio = (idx, valor) => {
        const nuevos = [...items];
        nuevos[idx] = { ...nuevos[idx], precio_unitario: valor };
        setItems(nuevos);
    };

    const total = items.reduce(
        (acc, i) => acc + Number(i.cantidad || 0) * Number(i.precio_unitario || 0), 0
    );

    const vender = async () => {

        const validos = items.filter(i => i.producto_id);

        if (validos.length === 0) {
            Swal.fire("Sin productos", "Agrega al menos un producto.", "warning");
            return;
        }

        try {
            setGuardando(true);

            const res = await ventaRepuestoService.crear({
                tipo_rubro: rubro,
                metodo_pago: metodo,
                observaciones: observaciones || null,
                items: validos.map(i => ({
                    producto_id: i.producto_id,
                    cantidad: Number(i.cantidad),
                    precio_unitario: Number(i.precio_unitario),
                })),
            });

            await Swal.fire("Venta registrada", `${res.data.codigo} - ${soles(res.data.total)}`, "success");

            setItems([]);
            setObservaciones("");
            cargar();

        } catch (error) {
            Swal.fire("No se pudo registrar la venta", obtenerMensajeError(error), "error");
        } finally {
            setGuardando(false);
        }
    };

    const anular = async (venta) => {
        const r = await Swal.fire({
            title: "¿Anular venta?",
            text: `${venta.codigo} - se devolverá el stock y se anulará el ingreso en caja.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, anular",
            cancelButtonText: "Cancelar",
        });

        if (!r.isConfirmed) return;

        try {
            await ventaRepuestoService.anular(venta.id);
            cargar();
        } catch (error) {
            Swal.fire("Error", obtenerMensajeError(error), "error");
        }
    };

    return (
        <div>

            <h2>Venta de repuestos</h2>
            <p className="text-muted">Venta directa sin orden - {rubro}</p>

            <div className="card mb-4">
                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Nueva venta</h5>
                        <button className="btn btn-success btn-sm" onClick={agregar}>+ Producto</button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th width="110">Cantidad</th>
                                    <th width="130">P.Unit</th>
                                    <th width="120">Subtotal</th>
                                    <th width="70"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 && (
                                    <tr><td colSpan="5" className="text-center text-muted">Sin productos</td></tr>
                                )}

                                {items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <select
                                                className="form-select"
                                                value={item.producto_id}
                                                onChange={(e) => elegir(idx, e.target.value)}
                                            >
                                                <option value="">Seleccione un producto</option>
                                                {productos.map(p => (
                                                    <option
                                                        key={p.id}
                                                        value={p.id}
                                                        disabled={usados.includes(p.id) && p.id !== item.producto_id}
                                                    >
                                                        {p.codigo} - {p.nombre} (stock: {p.stock_actual})
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="number" min="1" className="form-control"
                                                value={item.cantidad}
                                                onChange={(e) => cambiarCantidad(idx, e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number" step="0.01" className="form-control"
                                                value={item.precio_unitario}
                                                onChange={(e) => cambiarPrecio(idx, e.target.value)}
                                            />
                                        </td>
                                        <td>{soles(item.cantidad * item.precio_unitario)}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => quitar(idx)}>X</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="row align-items-end">
                        <div className="col-md-3">
                            <label className="form-label">Método de pago</label>
                            <select className="form-select" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                                {METODOS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div className="col-md-5">
                            <label className="form-label">Observaciones</label>
                            <input
                                className="form-control" value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                            />
                        </div>

                        <div className="col-md-4 text-end">
                            <h4 className="mb-2">Total: {soles(total)}</h4>
                            <button className="btn btn-primary" onClick={vender} disabled={guardando}>
                                {guardando ? "Registrando..." : "Registrar venta"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <h5>Últimas ventas</h5>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Código</th><th>Fecha</th><th>Vendedor</th>
                            <th>Método</th><th>Total</th><th>Estado</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.length === 0 ? (
                            <tr><td colSpan="7" className="text-center">Sin ventas</td></tr>
                        ) : ventas.map(v => (
                            <tr key={v.id} className={v.estado === "ANULADA" ? "text-muted text-decoration-line-through" : ""}>
                                <td>{v.codigo}</td>
                                <td>{new Date(v.created_at).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" })}</td>
                                <td>{v.usuario?.name}</td>
                                <td>{v.metodo_pago}</td>
                                <td>{soles(v.total)}</td>
                                <td>
                                    <span className={`badge ${v.estado === "COMPLETADA" ? "bg-success" : "bg-secondary"}`}>
                                        {v.estado}
                                    </span>
                                </td>
                                <td>
                                    {esAdmin && v.estado === "COMPLETADA" && (
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => anular(v)}>
                                            Anular
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}