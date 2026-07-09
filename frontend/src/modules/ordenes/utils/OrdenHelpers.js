export const safeParse = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return [];
    }
};


export const calcularTotalServicios = (detalles = []) =>
    detalles.reduce(
        (total, item) =>
            total + Number(item.precio || 0),
        0
    );


export const calcularTotalRepuestos = (repuestos = []) =>
    repuestos.reduce(
        (total, item) =>
            total + Number(item.subtotal || 0),
        0
    );


export const calcularTotal = (formData) =>
    calcularTotalServicios(formData.detalles) +
    calcularTotalRepuestos(formData.repuestos);


export const calcularSaldo = (
    total = 0,
    adelanto = 0
) =>
    Number(total) - Number(adelanto);


export const limpiarPayloadOrden = (formData) => ({

    ...formData,

    accesorios: JSON.stringify(
        formData.accesorios || []
    ),

    checklist_recepcion: JSON.stringify(
        formData.checklist_recepcion || []
    ),

    checklist_vehicular:
        Object.keys(formData)
            .filter(key => key.startsWith("check_"))
            .map(key => ({
                nombre:key,
                estado:Boolean(formData[key])
            })),

    servicios_vehiculares:
        Object.keys(formData)
            .filter(key => key.startsWith("servicio_"))
            .map(key => ({
                nombre:key,
                estado:Boolean(formData[key])
            })),

    detalles: formData.detalles || [],

    repuestos: formData.repuestos || [],

});