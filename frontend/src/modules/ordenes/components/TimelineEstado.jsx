const estados = [
    "RECEPCIONADO",
    "DIAGNOSTICO",
    "ESPERANDO_APROBACION",
    "EN_REPARACION",
    "REPARADO",
    "ENTREGADO"
];

export default function TimelineEstado({ estadoActual }) {

    const indiceActual =
        estados.indexOf(estadoActual);

    return (

        <div className="timeline-estado">

            {
                estados.map((estado, index) => {

                    let clase = "pendiente";

                    if (index < indiceActual)
                        clase = "completado";

                    if (index === indiceActual)
                        clase = "actual";

                    return (

                        <div
                            key={estado}
                            className={`timeline-item ${clase}`}
                        >

                            <div className="timeline-dot" />

                            <div className="timeline-content">

                                {estado.replaceAll("_", " ")}

                            </div>

                        </div>

                    );

                })
            }

        </div>

    );
}