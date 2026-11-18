import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import api from "../../../api/axios";
import { safeParse } from "../utils/OrdenHelpers";
import { ACCESORIOS_TECNOLOGIA } from "../constants/accesoriosTecnologia";
import { CHECKLIST_TECNOLOGIA } from "../constants/checklistTecnologia";
import { CHECKLIST_VEHICULAR } from "../constants/checklistVehicular";
import { SERVICIOS_VEHICULARES } from "../constants/serviciosVehiculares";

const soles = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

const fechaHora = (f) =>
    f ? new Date(f).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" }) : "-";

const soloFecha = (f) => {
    if (!f) return "-";
    const d = String(f).length === 10 ? new Date(`${f}T00:00:00`) : new Date(f);
    return d.toLocaleDateString("es-PE");
};

const lista = (v) => {
    const p = safeParse(v);
    return Array.isArray(p) ? p : [];
};

const vacio = (v) => (v === null || v === undefined || v === "" ? "-" : v);

function Campo({ etiqueta, valor }) {
    return (
        <div className="doc-campo">
            <small>{etiqueta}</small>
            <div>{vacio(valor)}</div>
        </div>
    );
}

function Seccion({ titulo, children }) {
    return (
        <section className="doc-seccion">
            <h6>{titulo}</h6>
            {children}
        </section>
    );
}

function Casillas({ opciones, marcadas, columnas = 3 }) {
    return (
        <div className="doc-casillas" style={{ gridTemplateColumns: `repeat(${columnas}, 1fr)` }}>
            {opciones.map((o) => (
                <span key={o.clave}>
                    {marcadas.includes(o.clave) ? "☑" : "☐"} {o.texto}
                </span>
            ))}
        </div>
    );
}

function TablaItems({ filas }) {
    if (filas.length === 0) {
        return <div className="doc-texto">-</div>;
    }

    return (
        <table className="doc-tabla">
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th style={{ width: 50 }}>Cant.</th>
                    <th style={{ width: 80 }}>P. unit.</th>
                    <th style={{ width: 85 }}>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {filas.map((f, i) => (
                    <tr key={i}>
                        <td>{f.desc}</td>
                        <td className="der">{f.cant}</td>
                        <td className="der">{soles(f.pu)}</td>
                        <td className="der">{soles(f.sub)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function OrdenImprimirPage() {

    const { id } = useParams();
    const [params] = useSearchParams();
    const esEntrega = params.get("tipo") === "entrega";

    const [orden, setOrden] = useState(null);
    const [negocio, setNegocio] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([api.get(`/ordenes-servicio/${id}`), api.get("/negocio")])
            .then(([o, n]) => {
                setOrden(o.data);
                setNegocio(n.data.data);
            })
            .catch((e) => setError(e.response?.data?.message || "No se pudo cargar la orden."));
    }, [id]);

    // El nombre del archivo al "Guardar como PDF"
    useEffect(() => {
        if (orden) {
            document.title = `${esEntrega ? "Acta" : "Recepcion"}-${orden.codigo_orden}`;
        }
    }, [orden, esEntrega]);

    if (error) return <div className="alert alert-danger m-4">{error}</div>;
    if (!orden || !negocio) return <div className="text-center mt-5">Cargando...</div>;

    const vehicular = orden.tipo_rubro === "VEHICULAR";
    const c = orden.cliente || {};
    const eq = orden.equipo || {};
    const ve = orden.vehiculo || {};
    const rec = orden.recepcion_vehicular || {};
    const dia = orden.diagnostico_vehicular || {};
    const prox = orden.proximo_mantenimiento || {};

    const nombreCliente =
        `${c.nombres || ""} ${c.apellidos || ""}`.trim() || c.razon_social || "-";

    const filas = [
        ...(orden.detalles || []).map((d) => ({
            desc: d.descripcion, cant: 1, pu: d.precio, sub: d.precio,
        })),
        ...(orden.repuestos || []).map((r) => ({
            desc: r.nombre, cant: r.cantidad, pu: r.precio_unitario, sub: r.subtotal,
        })),
    ];

    const condiciones = (
        esEntrega ? negocio.cond_entrega : vehicular ? negocio.cond_rec_veh : negocio.cond_rec_tec
    ).split("\n").filter(Boolean);

    const garantia = Number(orden.garantia_dias) > 0 ? Number(orden.garantia_dias) : negocio.garantia_dias;
    const fechaEntrega = orden.fecha_entrega_real ? new Date(orden.fecha_entrega_real) : new Date();
    const venceGarantia = new Date(fechaEntrega);
    venceGarantia.setDate(venceGarantia.getDate() + garantia);

    const titulo = esEntrega
        ? "ACTA DE ENTREGA"
        : vehicular ? "ORDEN DE RECEPCIÓN · TALLER VEHICULAR" : "ORDEN DE RECEPCIÓN · SERVICIO TÉCNICO";

    const hayProximo = prox.fecha || prox.kilometros || prox.indicaciones;

    return (
        <div className="doc-wrap">

            <style>{`
                .doc-wrap{background:#e9ecef;min-height:100vh;padding:16px}
                .doc-toolbar{max-width:210mm;margin:0 auto 12px;display:flex;gap:8px;justify-content:flex-end}
                .doc{background:#fff;color:#111;width:210mm;min-height:297mm;margin:0 auto;padding:9mm;box-sizing:border-box;
                     font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;line-height:1.3;box-shadow:0 2px 12px rgba(0,0,0,.15)}
                .doc-head{display:flex;gap:12px;align-items:center;border-bottom:2px solid #111;padding-bottom:6px;margin-bottom:8px}
                .doc-logo{width:64px;height:64px;display:flex;align-items:center;justify-content:center}
                .doc-logo img{max-width:100%;max-height:100%}
                .doc-negocio{flex:1}
                .doc-negocio strong{font-size:13pt}
                .doc-negocio div{font-size:8.5pt}
                .doc-codigo{text-align:right;border:1.5px solid #111;padding:5px 9px;min-width:150px}
                .doc-codigo b{font-size:12pt;display:block}
                .doc-codigo small{display:block;font-size:8pt}
                .doc-titulo{text-align:center;font-weight:700;font-size:11.5pt;letter-spacing:.5px;margin:4px 0 8px}
                .doc-seccion{margin-bottom:7px;break-inside:avoid}
                .doc-seccion h6{margin:0 0 3px;padding:2px 6px;background:#e5e5e5;font-size:8.5pt;text-transform:uppercase;letter-spacing:.4px;
                                -webkit-print-color-adjust:exact;print-color-adjust:exact}
                .doc-grid{display:grid;gap:3px 12px}
                .doc-campo small{display:block;color:#555;font-size:7.5pt;text-transform:uppercase}
                .doc-campo div{font-weight:600;min-height:12px}
                .doc-casillas{display:grid;gap:1px 10px;font-size:8.8pt}
                .doc-texto{white-space:pre-wrap;min-height:12px}
                .doc-tabla{width:100%;border-collapse:collapse;font-size:8.8pt}
                .doc-tabla th,.doc-tabla td{border:1px solid #999;padding:2px 5px}
                .doc-tabla th{background:#f0f0f0;text-align:left;-webkit-print-color-adjust:exact;print-color-adjust:exact}
                .doc-tabla .der{text-align:right}
                .doc-totales{margin-left:auto;width:230px;font-size:9.5pt}
                .doc-totales div{display:flex;justify-content:space-between;padding:1px 0}
                .doc-totales .fuerte{font-weight:700;border-top:1px solid #111;margin-top:2px;padding-top:2px}
                .doc-cond{font-size:7.8pt;color:#333;margin:0;padding-left:15px}
                .doc-firmas{display:flex;gap:40px;margin-top:20mm}
                .doc-firmas>div{flex:1;text-align:center;font-size:8.5pt}
                .doc-firmas .linea{border-top:1px solid #111;margin-bottom:3px}
                @page{size:A4;margin:9mm}
                @media print{
                    .doc-wrap{background:#fff;padding:0}
                    .doc-toolbar{display:none}
                    .doc{width:auto;min-height:0;margin:0;padding:0;box-shadow:none}
                }
            `}</style>

            <div className="doc-toolbar">
                <button className="btn btn-primary" onClick={() => window.print()}>
                    Imprimir / Guardar PDF
                </button>
                <button className="btn btn-outline-secondary" onClick={() => window.close()}>
                    Cerrar
                </button>
            </div>

            <div className="doc">

                {/* ENCABEZADO */}
                <div className="doc-head">

                    <div className="doc-logo">
                        {negocio.logo_url && <img src={negocio.logo_url} alt="" />}
                    </div>

                    <div className="doc-negocio">
                        <strong>{negocio.nombre || "Nombre del negocio"}</strong>
                        {negocio.ruc && <div>RUC: {negocio.ruc}</div>}
                        {negocio.direccion && <div>{negocio.direccion}</div>}
                        {negocio.telefono && <div>Tel.: {negocio.telefono}</div>}
                    </div>

                    <div className="doc-codigo">
                        <small>{esEntrega ? "ORDEN" : "N.º DE ORDEN"}</small>
                        <b>{orden.codigo_orden}</b>
                        <small>Ingreso: {fechaHora(orden.fecha_ingreso)}</small>
                        {esEntrega && <small>Entrega: {fechaHora(fechaEntrega)}</small>}
                    </div>

                </div>

                <div className="doc-titulo">{titulo}</div>

                {/* CLIENTE Y EQUIPO / VEHÍCULO */}
                <Seccion titulo="Cliente">
                    <div className="doc-grid" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
                        <Campo etiqueta="Nombre" valor={nombreCliente} />
                        <Campo etiqueta="Documento" valor={c.numero_documento} />
                        <Campo etiqueta="Celular" valor={c.celular} />
                    </div>
                </Seccion>

                <Seccion titulo={vehicular ? "Vehículo" : "Equipo"}>
                    {vehicular ? (
                        <div className="doc-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}>
                            <Campo etiqueta="Placa" valor={ve.placa} />
                            <Campo etiqueta="Marca" valor={ve.marca} />
                            <Campo etiqueta="Modelo" valor={ve.modelo} />
                            <Campo etiqueta="Kilometraje" valor={rec.kilometraje} />
                            <Campo etiqueta="Combustible" valor={rec.combustible} />
                        </div>
                    ) : (
                        <div className="doc-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
                            <Campo etiqueta="Marca" valor={eq.marca} />
                            <Campo etiqueta="Modelo" valor={eq.modelo} />
                            <Campo etiqueta="IMEI" valor={eq.imei} />
                            <Campo etiqueta="N.º de serie" valor={eq.numero_serie} />
                        </div>
                    )}
                </Seccion>

                <Seccion titulo="Falla reportada">
                    <div className="doc-texto">{vacio(orden.falla_reportada)}</div>
                </Seccion>

                {/* ============ RECEPCIÓN ============ */}
                {!esEntrega && !vehicular && (
                    <>
                        <Seccion titulo="Accesorios entregados">
                            <Casillas
                                columnas={4}
                                opciones={ACCESORIOS_TECNOLOGIA.map((a) => ({ clave: a, texto: a }))}
                                marcadas={lista(orden.accesorios)}
                            />
                        </Seccion>

                        <Seccion titulo="Estado del equipo al ingreso">
                            <Casillas
                                columnas={3}
                                opciones={CHECKLIST_TECNOLOGIA.map((a) => ({ clave: a, texto: a }))}
                                marcadas={lista(orden.checklist_recepcion)}
                            />
                            <div style={{ marginTop: 3 }}>
                                Equipo con clave de bloqueo: <b>{orden.contrasena ? "Sí" : "No"}</b>
                            </div>
                        </Seccion>

                        <Seccion titulo="Diagnóstico preliminar">
                            <div className="doc-texto">{vacio(orden.diagnostico_preliminar)}</div>
                        </Seccion>
                    </>
                )}

                {!esEntrega && vehicular && (
                    <>
                        <Seccion titulo="Estado del vehículo al ingreso">
                            <Casillas
                                columnas={4}
                                opciones={CHECKLIST_VEHICULAR.map((i) => ({ clave: i.name, texto: i.label }))}
                                marcadas={lista(orden.checklist_vehicular).filter((i) => i.estado).map((i) => i.nombre)}
                            />
                        </Seccion>

                        <Seccion titulo="Servicios solicitados">
                            <Casillas
                                columnas={3}
                                opciones={SERVICIOS_VEHICULARES.map((i) => ({ clave: i.name, texto: i.label }))}
                                marcadas={lista(orden.servicios_vehiculares).filter((i) => i.estado).map((i) => i.nombre)}
                            />
                        </Seccion>

                        <Seccion titulo="Diagnóstico por sistema">
                            <table className="doc-tabla">
                                <tbody>
                                    {[
                                        ["Motor", dia.motor],
                                        ["Transmisión", dia.transmision],
                                        ["Suspensión", dia.suspension],
                                        ["Frenos", dia.frenos],
                                        ["Eléctrico", dia.electrico],
                                        ["Observaciones", dia.observaciones],
                                    ].map(([n, v]) => (
                                        <tr key={n}>
                                            <td style={{ width: 95, fontWeight: 600 }}>{n}</td>
                                            <td>{vacio(v)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Seccion>
                    </>
                )}

                {/* ============ ENTREGA ============ */}
                {esEntrega && (
                    <Seccion titulo="Diagnóstico final">
                        <div className="doc-texto">{vacio(orden.diagnostico_final)}</div>
                    </Seccion>
                )}

                <Seccion titulo={esEntrega ? "Trabajos realizados y repuestos" : "Servicios y repuestos estimados"}>
                    <TablaItems filas={filas} />
                </Seccion>

                {/* TOTALES */}
                <div className="doc-seccion">
                    <div className="doc-totales">
                        <div><span>Total</span><span>{soles(orden.total)}</span></div>
                        <div><span>{esEntrega ? "Pagado" : "Adelanto"}</span><span>{soles(orden.adelanto)}</span></div>
                        <div className="fuerte"><span>Saldo</span><span>{soles(orden.saldo_pendiente)}</span></div>
                    </div>
                </div>

                {/* PAGOS Y GARANTÍA (entrega) */}
                {esEntrega && (
                    <>
                        {(orden.pagos || []).length > 0 && (
                            <Seccion titulo="Pagos registrados">
                                <table className="doc-tabla">
                                    <tbody>
                                        {orden.pagos.map((p) => (
                                            <tr key={p.id}>
                                                <td>{fechaHora(p.created_at)}</td>
                                                <td>{p.metodo_pago}</td>
                                                <td className="der">{soles(p.monto)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Seccion>
                        )}

                        <Seccion titulo="Garantía">
                            <div className="doc-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                                <Campo etiqueta="Plazo" valor={garantia > 0 ? `${garantia} días` : "Sin garantía"} />
                                <Campo etiqueta="Desde" valor={soloFecha(fechaEntrega)} />
                                <Campo etiqueta="Vence" valor={garantia > 0 ? soloFecha(venceGarantia) : "-"} />
                            </div>
                        </Seccion>

                        {vehicular && hayProximo && (
                            <Seccion titulo="Próximo mantenimiento">
                                <div className="doc-grid" style={{ gridTemplateColumns: "1fr 1fr 2fr" }}>
                                    <Campo etiqueta="Fecha" valor={prox.fecha ? soloFecha(prox.fecha) : null} />
                                    <Campo etiqueta="Kilómetros" valor={prox.kilometros} />
                                    <Campo etiqueta="Indicaciones" valor={prox.indicaciones} />
                                </div>
                            </Seccion>
                        )}
                    </>
                )}

                {/* CONDICIONES */}
                <Seccion titulo="Condiciones del servicio">
                    <ol className="doc-cond">
                        {condiciones.map((t, i) => <li key={i}>{t}</li>)}
                    </ol>
                </Seccion>

                {/* FIRMAS */}
                <div className="doc-firmas">
                    <div>
                        <div className="linea" />
                        {esEntrega ? "Conforme: firma del cliente" : "Firma del cliente"}
                        <br />
                        {nombreCliente}{c.numero_documento ? ` · ${c.numero_documento}` : ""}
                    </div>
                    <div>
                        <div className="linea" />
                        {esEntrega ? "Entregado por" : "Recibido por"}
                        <br />
                        {orden.usuario?.name || orden.tecnico?.name || ""}
                    </div>
                </div>

            </div>
        </div>
    );
}