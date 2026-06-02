import { Link } from "react-router-dom";

function Sidebar() {

  return (

   <div
    style={{
        width: "260px",
        background: "#0f172a",
        minHeight: "100vh",
        padding: "25px 20px",
        color: "white",
        position: "fixed",
        left: 0,
        top: 0
    }}
>

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

    <div className="d-flex flex-column gap-2">

        <Link
        className="sidebar-link"
        to="/dashboard"
        >
        Dashboard
        </Link>

        <Link
        className="sidebar-link"
        to="/clientes"
        >
        Clientes
        </Link>

        <Link
            to="/ordenes"
            className="sidebar-link"
        >
            Órdenes de Servicio
        </Link>

         <Link
        className="sidebar-link"
        to="/equipos"
        >
        Equipos
        </Link>

        <a className="sidebar-link" href="#">
            Inventario
        </a>

        <a className="sidebar-link" href="#">
            Usuarios
        </a>

    </div>

</div>

  );

}

export default Sidebar;