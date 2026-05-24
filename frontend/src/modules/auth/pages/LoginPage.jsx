import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import api from "../../../api/axios";
import useAuthStore from "../../../store/authStore";

function LoginPage() {

  const { register, handleSubmit } = useForm();

  const loginStore = useAuthStore((state) => state.login);

  const onSubmit = async (data) => {

    try {

      const response = await api.post("/login", data);

      loginStore(
        response.data.token,
        response.data.user
      );

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: "Login correcto"
      });

      window.location.href = "/dashboard";

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales incorrectas"
      });

    }

  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-4">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="text-center mb-4">
                RepairService
              </h3>

              <form onSubmit={handleSubmit(onSubmit)}>

                <div className="mb-3">

                  <label>Email</label>

                  <input
                    type="email"
                    className="form-control"
                    {...register("email")}
                  />

                </div>

                <div className="mb-3">

                  <label>Password</label>

                  <input
                    type="password"
                    className="form-control"
                    {...register("password")}
                  />

                </div>

                <button
                  className="btn btn-primary w-100"
                >
                  Ingresar
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default LoginPage;