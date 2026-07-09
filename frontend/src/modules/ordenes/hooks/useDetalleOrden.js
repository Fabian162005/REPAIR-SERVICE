export default function useDetalleOrden(setFormData) {

    const agregarServicio = () => {
        setFormData((prev) => ({
            ...prev,
            detalles: [
                ...(prev.detalles || []),
                {
                    descripcion: "",
                    precio: 0,
                },
            ],
        }));
    };

    const eliminarServicio = (index) => {
        setFormData((prev) => ({
            ...prev,
            detalles: prev.detalles.filter((_, i) => i !== index),
        }));
    };

    const actualizarServicio = (index, campo, valor) => {
        setFormData((prev) => {
            const detalles = [...(prev.detalles || [])];

            detalles[index] = {
                ...detalles[index],
                [campo]: valor,
            };

            return {
                ...prev,
                detalles,
            };
        });
    };

    const agregarRepuesto = () => {
        setFormData((prev) => ({
            ...prev,
            repuestos: [
                ...(prev.repuestos || []),
                {
                    nombre: "",
                    cantidad: 1,
                    precio_unitario: 0,
                    subtotal: 0,
                },
            ],
        }));
    };

    const eliminarRepuesto = (index) => {
        setFormData((prev) => ({
            ...prev,
            repuestos: prev.repuestos.filter((_, i) => i !== index),
        }));
    };

    const actualizarRepuesto = (index, campo, valor) => {
        setFormData((prev) => {
            const repuestos = [...(prev.repuestos || [])];

            repuestos[index] = {
                ...repuestos[index],
                [campo]: valor,
            };

            if (campo === "cantidad" || campo === "precio_unitario") {
                repuestos[index].subtotal =
                    Number(repuestos[index].cantidad || 0) *
                    Number(repuestos[index].precio_unitario || 0);
            }

            return {
                ...prev,
                repuestos,
            };
        });
    };

    return {
        agregarServicio,
        eliminarServicio,
        actualizarServicio,
        agregarRepuesto,
        eliminarRepuesto,
        actualizarRepuesto,
    };
}