// Hora local del navegador en formato "AAAA-MM-DD HH:mm:ss".
// toISOString() daba la hora UTC, 5 horas adelantada respecto a Lima.
const ahoraLocal = () => {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");

    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

export const ORDEN_INITIAL_STATE = {
    cliente_id: "",
    equipo_id: "",
    vehiculo_id: "",
    tipo_rubro: "",
    falla_reportada: "",
    accesorios: [],
    checklist_recepcion: [],
    checklist_vehicular: [],
    contrasena: "",
    prioridad: "MEDIA",

    // Getters: se evalúan cada vez que se hace {...ORDEN_INITIAL_STATE},
    // así la hora siempre es la de ese momento y no la de la carga de la app.
    get fecha_ingreso() { return ahoraLocal(); },
    get fecha_ingreso_recepcion() { return ahoraLocal(); },

    kilometraje_ingreso: "",
    combustible_ingreso: "",
    diagnostico_motor: "",
    diagnostico_transmision: "",
    diagnostico_suspension: "",
    diagnostico_frenos: "",
    diagnostico_electrico: "",
    diagnostico_observaciones: "",
    check_luces: false,
    check_frenos: false,
    check_espejos: false,
    check_llantas: false,
    check_rayones: false,
    check_nivel_combustible: false,
    check_bateria: false,
    check_aceite: false,
    servicio_cambio_aceite: false,
    servicio_mantenimiento: false,
    servicio_lavado: false,
    servicio_frenos: false,
    servicio_suspension: false,
    servicio_motor: false,
    proximo_fecha: "",
    proximo_kilometros: "",
    proximo_indicaciones: "",
    total: 0,
    adelanto: 0,
    metodo_pago_adelanto: "EFECTIVO",
    estado_actual: "RECEPCIONADO",
    diagnostico_preliminar: "",
    diagnostico_final: "",
    detalles: [],
    repuestos: [],
};