import { Link } from "react-router-dom";
import { useRubro } from "../context/RubroContext";

function Sidebar() {

    const { rubro } = useRubro();


const sidebarStyle = {
    width: "260px",
    minHeight: "100vh",
    padding: "25px 20px",
    color: "white",
    position: "fixed",
    left: 0,
    top: 0,
    transition: "all .3s ease",
    background: rubro === "TECNOLOGIA"
        ? "#0182fd"   // azul oscuro técnico
        : "#006400"   // verde oscuro taller vehicular
};

    return (

        <div style={sidebarStyle}>

            {/* LOGO */}
            <div className="mb-5">

                <img
                    src="/logo-repair-service.png"
                    alt="logo"
                    style={{
                        width: "100%",
                        maxWidth: "170px",
                        display: "block",
                        margin: "0 auto"
                    }}
                />

            </div>

            {/* MENU */}
            <div className="d-flex flex-column gap-2">

                <Link className="sidebar-link" to="/dashboard">
                    Dashboard
                </Link>

                <Link className="sidebar-link" to="/clientes">
                    Clientes
                </Link>

                {/* ORDENES */}
                <Link className="sidebar-link" to="/ordenes">
                    {rubro === "TECNOLOGIA"
                        ? "Órdenes de Servicio"
                        : "Órdenes Vehiculares"
                    }
                </Link>

                {/* EQUIPOS / VEHICULOS */}
                <Link className="sidebar-link" to="/equipos">
                    {rubro === "TECNOLOGIA"
                        ? "Equipos"
                        : "Vehículos"
                    }
                </Link>

                {/* INVENTARIO */}

                <Link 
                    className="sidebar-link" 
                    to="/productos"
                >
                    {rubro === "TECNOLOGIA"
                        ? "Inventario"
                        : "Repuestos de Vehículos"
                    }
                </Link>

                <a className="sidebar-link" href="#">
                    Usuarios
                </a>

            </div>

        </div>

    );

}

export default Sidebar;