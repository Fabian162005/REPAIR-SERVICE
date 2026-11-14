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
import ProductosPage from "./modules/Inventario/pages/ProductosPage";
import CajaPage from "./modules/caja/pages/CajaPage";
import VentasRepuestoPage from "./modules/ventas/pages/VentasRepuestoPage";
import UsuariosPage from "./modules/usuarios/pages/UsuariosPage";
import ConfiguracionPage from "./modules/configuracion/pages/ConfiguracionPage";


function AppRoutes() {

  const token = useAuthStore((state) => state.token);
  const { rubro } = useRubro();
const user = useAuthStore((state) => state.user);

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

        <Route
              path="/productos"
              element={
                  token ? (
                      <DashboardLayout>
                          <ProductosPage />
                      </DashboardLayout>
                  ) : (
                      <Navigate to="/" />
                  )
              }
          />

          <Route
            path="/caja"
            element={
                token ? (
                    <DashboardLayout>
                        <CajaPage />
                    </DashboardLayout>
                ) : (
                    <Navigate to="/" />
                )
            }
        />

        <Route
        path="/ventas"
        element={
            token ? (
                <DashboardLayout>
                    <VentasRepuestoPage />
                </DashboardLayout>
            ) : (
                <Navigate to="/" />
            )
        }
    />

    <Route
    path="/usuarios"
    element={
        token && user?.rol === "ADMIN" ? (
            <DashboardLayout>
                <UsuariosPage />
            </DashboardLayout>
        ) : (
            <Navigate to="/" />
        )
    }
/>


<Route
    path="/configuracion"
    element={
        token ? (
            <DashboardLayout>
                <ConfiguracionPage />
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