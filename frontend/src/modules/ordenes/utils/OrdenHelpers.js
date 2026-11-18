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

export const limpiarPayloadOrden = (formData) => {

    const esVehicular = formData.tipo_rubro === "VEHICULAR";

    return {

        ...formData,

        accesorios: JSON.stringify(formData.accesorios || []),

        checklist_recepcion: JSON.stringify(formData.checklist_recepcion || []),

        checklist_vehicular:
            Object.keys(formData)
                .filter((key) => key.startsWith("check_"))
                .map((key) => ({ nombre: key, estado: Boolean(formData[key]) })),

        servicios_vehiculares:
            Object.keys(formData)
                .filter((key) => key.startsWith("servicio_"))
                .map((key) => ({ nombre: key, estado: Boolean(formData[key]) })),

        recepcion_vehicular: esVehicular ? {
            kilometraje: formData.kilometraje_ingreso || null,
            combustible: formData.combustible_ingreso || null,
        } : null,

        diagnostico_vehicular: esVehicular ? {
            motor: formData.diagnostico_motor || "",
            transmision: formData.diagnostico_transmision || "",
            suspension: formData.diagnostico_suspension || "",
            frenos: formData.diagnostico_frenos || "",
            electrico: formData.diagnostico_electrico || "",
            observaciones: formData.diagnostico_observaciones || "",
        } : null,

        proximo_mantenimiento: esVehicular ? {
            fecha: formData.proximo_fecha || null,
            kilometros: formData.proximo_kilometros || null,
            indicaciones: formData.proximo_indicaciones || "",
        } : null,

        detalles: formData.detalles || [],

        repuestos: (formData.repuestos || []).filter((r) => r.producto_id || r.nombre),
    };
};

/** Al editar: convierte los datos guardados otra vez en los campos del formulario */
export const aplanarOrdenVehicular = (orden) => {

    const rec = orden.recepcion_vehicular || {};
    const dia = orden.diagnostico_vehicular || {};
    const prox = orden.proximo_mantenimiento || {};

    const plano = {};

    [
        [rec, "kilometraje", "kilometraje_ingreso"],
        [rec, "combustible", "combustible_ingreso"],
        [dia, "motor", "diagnostico_motor"],
        [dia, "transmision", "diagnostico_transmision"],
        [dia, "suspension", "diagnostico_suspension"],
        [dia, "frenos", "diagnostico_frenos"],
        [dia, "electrico", "diagnostico_electrico"],
        [dia, "observaciones", "diagnostico_observaciones"],
        [prox, "fecha", "proximo_fecha"],
        [prox, "kilometros", "proximo_kilometros"],
        [prox, "indicaciones", "proximo_indicaciones"],
    ].forEach(([origen, clave, destino]) => {
        if (origen[clave] !== undefined && origen[clave] !== null) {
            plano[destino] = origen[clave];
        }
    });

    (Array.isArray(orden.checklist_vehicular) ? orden.checklist_vehicular : [])
        .forEach((i) => { plano[i.nombre] = !!i.estado; });

    (Array.isArray(orden.servicios_vehiculares) ? orden.servicios_vehiculares : [])
        .forEach((i) => { plano[i.nombre] = !!i.estado; });

    return plano;
};