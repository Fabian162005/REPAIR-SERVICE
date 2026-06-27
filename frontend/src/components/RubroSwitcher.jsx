import { useRubro } from "../context/RubroContext";

function RubroSwitcher() {

    const { rubro, cambiarRubro } = useRubro();

    return (
        <>
            <style>{`

                .rubro-switch{

                    display:flex;
                    align-items:center;
                    gap:10px;

                }

                .rubro-option{

                    min-width:185px;

                    padding:11px 22px;

                    border-radius:50px;

                    border:1px solid #dbe4ea;

                    background:#ffffff;

                    color:#5b6470;

                    font-weight:600;

                    font-size:15px;

                    transition:all .25s ease;

                    box-shadow:0 2px 8px rgba(0,0,0,.05);

                }

                .rubro-option i{

                    font-size:18px;

                    margin-right:8px;

                    transition:.25s;

                }

                .rubro-option:hover{

                    transform:translateY(-2px);

                    box-shadow:0 8px 20px rgba(0,0,0,.10);

                }

                .rubro-option:hover i{

                    transform:scale(1.08);

                }

                /*==============================
                    SERVICIO TÉCNICO
                ==============================*/

                .rubro-option.tecnologia.active{

                    background:#0182fd;

                    border-color:#1697F6;

                    color:white;

                    box-shadow:0 10px 25px rgba(22,151,246,.28);

                }

                /*==============================
                    TALLER VEHICULAR
                ==============================*/

                .rubro-option.vehicular.active{

                    background: #006400;
                    border-color: #43A047;

                    color:white;

                    box-shadow:0 10px 25px rgba(126,211,33,.28);

                }

                .modo-label{

                    font-size:13px;

                    color:#6b7280;

                    font-weight:600;

                    margin-right:10px;

                    letter-spacing:.3px;

                }

                @media(max-width:992px){

                    .rubro-switch{

                        flex-direction:column;

                        width:100%;

                    }

                    .rubro-option{

                        width:100%;

                    }

                }

            `}</style>

            <div className="d-flex align-items-center">

                <span className="modo-label">

                    Modo:

                </span>

                <div className="rubro-switch">

                    <button

                        type="button"

                        className={`rubro-option tecnologia ${
                            rubro === "TECNOLOGIA"
                                ? "active"
                                : ""
                        }`}

                        onClick={() =>
                            cambiarRubro("TECNOLOGIA")
                        }

                    >

                        <i className={`bi ${
                            rubro === "TECNOLOGIA"
                                ? "bi-pc-display"
                                : "bi-pc-display-horizontal"
                        }`}></i>

                        Servicio Técnico

                    </button>

                    <button

                        type="button"

                        className={`rubro-option vehicular ${
                            rubro === "VEHICULAR"
                                ? "active"
                                : ""
                        }`}

                        onClick={() =>
                            cambiarRubro("VEHICULAR")
                        }

                    >

                        <i className={`bi ${
                            rubro === "VEHICULAR"
                                ? "bi-car-front-fill"
                                : "bi-car-front"
                        }`}></i>

                        Taller Vehicular

                    </button>

                </div>

            </div>

        </>
    );

}

export default RubroSwitcher;