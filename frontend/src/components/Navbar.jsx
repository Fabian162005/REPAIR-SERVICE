import Swal from "sweetalert2";

import useAuthStore from "../store/authStore";

function Navbar() {

  const logout = useAuthStore((state) => state.logout);

  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {

    logout();

    Swal.fire({
      icon: "success",
      title: "Sesión cerrada"
    });

    window.location.href = "/";

  };

  return (

    <div
      className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center"
    >

      <h5 className="m-0">
        RepairService
      </h5>

      <div className="d-flex align-items-center gap-3">

        <span>
          {user?.name}
        </span>

        <button
          className="btn btn-danger btn-sm"
          onClick={handleLogout}
        >
          Salir
        </button>

      </div>

    </div>

  );

}

export default Navbar;