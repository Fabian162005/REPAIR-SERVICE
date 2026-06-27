import Swal from "sweetalert2";

import useAuthStore from "../store/authStore";

import RubroSwitcher from "./RubroSwitcher";

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

        <div className="bg-white shadow-sm px-4 py-3">

            <div className="d-flex align-items-center justify-content-between">

                {/* Logo y nombre */}
                <div className="d-flex align-items-center">

                    <h5 className="m-0 fw-bold text-dark">

                        RepairService

                    </h5>

                </div>

                {/* Selector de rubro */}
                <RubroSwitcher />

                {/* Usuario */}
                <div className="d-flex align-items-center gap-3">

                    <span className="fw-semibold text-secondary">

                        <i className="bi bi-person-circle me-2"></i>

                        {user?.name}

                    </span>

                    <button
                        className="btn btn-danger btn-sm"
                        onClick={handleLogout}
                    >

                        <i className="bi bi-box-arrow-right me-2"></i>

                        Salir

                    </button>

                </div>

            </div>

        </div>

    );

}

export default Navbar;