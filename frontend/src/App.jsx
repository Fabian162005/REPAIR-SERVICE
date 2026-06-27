import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useRubro } from "./context/RubroContext";

import LoginPage from "./modules/auth/pages/LoginPage";
import DashboardPage from "./modules/dashboard/pages/DashboardPage";
import ClientesPage from "./modules/clientes/pages/ClientesPage";
import EquiposPage from "./modules/equipos/pages/EquiposPage";
import VehiculosPage from "./modules/vehiculos/VehiculosPage";
import OrdenesPage from "./modules/ordenes/pages/OrdenesPage";

import DashboardLayout from "./layouts/DashboardLayout";
import useAuthStore from "./store/authStore";

function AppRoutes() {

  const token = useAuthStore((state) => state.token);
  const { rubro } = useRubro();

  const EquiposOrVehiculos =
    rubro === "TECNOLOGIA"
      ? EquiposPage
      : VehiculosPage;

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<LoginPage />} />

        {/* DASHBOARD */}
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

        {/* CLIENTES */}
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

        {/* EQUIPOS / VEHÍCULOS (DINÁMICO POR RUBRO) */}
        <Route
          path="/equipos"
          element={
            token ? (
              <DashboardLayout>
                <EquiposOrVehiculos />
              </DashboardLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ORDENES */}
        <Route
          path="/ordenes"
          element={
            token ? (
              <DashboardLayout>
                <OrdenesPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;