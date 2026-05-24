import { Link } from "react-router-dom";

function Sidebar() {

  return (

    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        minHeight: "100vh"
      }}
    >

      <h3 className="mb-4 text-info">
        RepairService
      </h3>

      <ul className="nav flex-column">

        <li className="nav-item mb-2">
          <Link
            to="/dashboard"
            className="nav-link text-white"
          >
            Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/clientes"
            className="nav-link text-white"
          >
            Clientes
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/ordenes"
            className="nav-link text-white"
          >
            Órdenes
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/equipos"
            className="nav-link text-white"
          >
            Equipos
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/inventario"
            className="nav-link text-white"
          >
            Inventario
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/usuarios"
            className="nav-link text-white"
          >
            Usuarios
          </Link>
        </li>

      </ul>

    </div>

  );

}

export default Sidebar;