import { useEffect, useState } from "react";
import { Col, Form, Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";

import productoService from "../../Inventario/services/productoService";

const repuestoVacio = {
    producto_id: "",
    nombre: "",
    cantidad: 1,
    precio_unitario: 0,
    subtotal: 0
};

export default function RepuestosTabla({ formData, setFormData }) {

    const [productos, setProductos] = useState([]);

    const esEdicion = !!formData.id;

    // CARGAR PRODUCTOS DEL RUBRO DE LA ORDEN
    useEffect(() => {

        const cargar = async () => {
            try {
                const data = await productoService.listarProductos();

                setProductos(
                    (data || []).filter(
                        p => p.categoria?.tipo_rubro === formData.tipo_rubro
                    )
                );
            } catch (error) {
                console.error(error);
                setProductos([]);
            }
        };

        cargar();

    }, [formData.tipo_rubro]);


    const repuestos = formData.repuestos || [];

    const setRepuestos = (nuevos) => {
        setFormData(prev => ({ ...prev, repuestos: nuevos }));
    };

    const calcular = (item) => ({
        ...item,
        subtotal: Number(
            (Number(item.cantidad || 0) * Number(item.precio_unitario || 0)).toFixed(2)
        )
    });


    const agregar = () => {
        setRepuestos([...repuestos, { ...repuestoVacio }]);
    };

    const eliminar = (index) => {
        setRepuestos(repuestos.filter((_, i) => i !== index));
    };


    // AL ELEGIR UN PRODUCTO: nombre y precio automáticos
    const elegirProducto = (index, productoId) => {

        const producto = productos.find(p => p.id === Number(productoId));

        const nuevos = [...repuestos];

        if (!producto) {
            nuevos[index] = { ...repuestoVacio };
            setRepuestos(nuevos);
            return;
        }

        if (producto.stock_actual <= 0 && !esEdicion) {
            Swal.fire("Sin stock", `"${producto.nombre}" no tiene stock disponible.`, "warning");
            return;
        }

        nuevos[index] = calcular({
            ...nuevos[index],
            producto_id: producto.id,
            nombre: producto.nombre,
            cantidad: 1,
            precio_unitario: producto.precio_venta
        });

        setRepuestos(nuevos);
    };


    const cambiarCantidad = (index, valor) => {

        const item = repuestos[index];
        const producto = productos.find(p => p.id === Number(item.producto_id));

        let cantidad = Math.max(1, parseInt(valor) || 1);

        // En una orden nueva el tope es el stock actual.
        // En edición no se recorta: el backend valida contra el stock real.
        if (producto && !esEdicion && cantidad > producto.stock_actual) {
            cantidad = producto.stock_actual;

            Swal.fire(
                "Stock insuficiente",
                `Solo hay ${producto.stock_actual} unidades de "${producto.nombre}".`,
                "warning"
            );
        }

        const nuevos = [...repuestos];
        nuevos[index] = calcular({ ...item, cantidad });
        setRepuestos(nuevos);
    };


    const cambiarPrecio = (index, valor) => {
        const nuevos = [...repuestos];
        nuevos[index] = calcular({ ...nuevos[index], precio_unitario: valor });
        setRepuestos(nuevos);
    };


    // productos ya usados en otras filas (para no repetirlos)
    const usados = repuestos.map(r => Number(r.producto_id)).filter(Boolean);


    return (
        <Col md={12}>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Repuestos Utilizados</h5>

                <Button size="sm" variant="success" onClick={agregar}>
                    + Repuesto
                </Button>
            </div>

            <Table bordered>

                <thead>
                    <tr>
                        <th>Producto (inventario)</th>
                        <th width="110">Cantidad</th>
                        <th width="120">P.Unit</th>
                        <th width="120">Subtotal</th>
                        <th width="80">Acción</th>
                    </tr>
                </thead>

                <tbody>

                    {repuestos.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">
                                Sin repuestos
                            </td>
                        </tr>
                    )}

                    {repuestos.map((item, index) => {

                        const producto = productos.find(
                            p => p.id === Number(item.producto_id)
                        );

                        const excede = producto && Number(item.cantidad) > producto.stock_actual;

                        return (
                            <tr key={index}>

                                <td>

                                    {/* Repuesto antiguo escrito a mano (sin producto del inventario) */}
                                    {!item.producto_id && item.nombre ? (

                                        <div>
                                            {item.nombre}
                                            <span className="badge bg-secondary ms-2">Manual</span>
                                        </div>

                                    ) : (

                                        <Form.Select
                                            value={item.producto_id || ""}
                                            onChange={(e) => elegirProducto(index, e.target.value)}
                                        >
                                            <option value="">Seleccione un producto</option>

                                            {productos.map(p => (
                                                <option
                                                    key={p.id}
                                                    value={p.id}
                                                    disabled={
                                                        (usados.includes(p.id) && p.id !== Number(item.producto_id))
                                                        || (p.stock_actual <= 0 && !esEdicion)
                                                    }
                                                >
                                                    {p.codigo} - {p.nombre} (stock: {p.stock_actual})
                                                </option>
                                            ))}
                                        </Form.Select>

                                    )}

                                    {producto && (
                                        <small className={excede ? "text-danger" : "text-muted"}>
                                            Disponible: {producto.stock_actual}
                                        </small>
                                    )}

                                </td>

                                <td>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={item.cantidad}
                                        isInvalid={excede}
                                        onChange={(e) => cambiarCantidad(index, e.target.value)}
                                    />
                                </td>

                                <td>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={item.precio_unitario}
                                        onChange={(e) => cambiarPrecio(index, e.target.value)}
                                    />
                                </td>

                                <td>
                                    <Form.Control value={item.subtotal || 0} disabled />
                                </td>

                                <td>
                                    <Button variant="danger" size="sm" onClick={() => eliminar(index)}>
                                        X
                                    </Button>
                                </td>

                            </tr>
                        );
                    })}

                </tbody>

            </Table>

        </Col>
    );
}