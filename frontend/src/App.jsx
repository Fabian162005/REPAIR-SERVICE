import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";


import LoginPage from "./modules/auth/pages/LoginPage";
import DashboardPage from "./modules/dashboard/pages/DashboardPage";
import ClientesPage from "./modules/clientes/pages/ClientesPage";
import EquiposPage from "./modules/equipos/pages/EquiposPage";
import DashboardLayout from "./layouts/DashboardLayout";
import OrdenesPage from "./modules/ordenes/pages/OrdenesPage";

import useAuthStore from "./store/authStore";

function App() {

  const token = useAuthStore((state) => state.token);

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/dashboard"
          element={
            token ? (
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />


        <Route
          path="/clientes"
          element={
            token ? (
              <DashboardLayout>
                <ClientesPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/equipos"
          element={
            token ? (
              <DashboardLayout>
                <EquiposPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
            path="/ordenes"
            element={<OrdenesPage />}
        />

    

      </Routes>

    </BrowserRouter>

  );

}

export default App;