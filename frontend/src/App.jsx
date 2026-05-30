import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";


import LoginPage from "./modules/auth/pages/LoginPage";
import DashboardPage from "./modules/dashboard/pages/DashboardPage";
import ClientesPage from "./modules/clientes/pages/ClientesPage";

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
            token
              ? <DashboardPage />
              : <Navigate to="/" />
          }
        />

        <Route path="/clientes" element={<ClientesPage />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;