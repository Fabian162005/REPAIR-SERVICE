import { createContext, useContext, useEffect, useState } from "react";

import api from "../api/axios";
import useAuthStore from "../store/authStore";

const RubroContext = createContext();

const CLAVE = "repairservice_rubro";

export function RubroProvider({ children }) {

    const token = useAuthStore((s) => s.token);

    const [plan, setPlan] = useState(null);

    // Sin sesión no hay nada que cargar
    const [listo, setListo] = useState(() => !useAuthStore.getState().token);

    const [rubro, setRubro] = useState(() => {
        return localStorage.getItem(CLAVE) || "TECNOLOGIA";
    });

    useEffect(() => {

        if (!token) {
            setPlan(null);
            setListo(true);
            return;
        }

        let vigente = true;

        setListo(false);

        api.get("/plan")
            .then(({ data }) => {
                if (!vigente) return;

                const p = data.data;
                setPlan(p);

                // Cuenta de un solo rubro: se fija
                if (p.rubros !== "AMBOS") {
                    setRubro(p.rubros);
                }
            })
            .catch(() => {})
            .finally(() => {
                if (vigente) setListo(true);
            });

        return () => { vigente = false; };

    }, [token]);

    useEffect(() => {
        localStorage.setItem(CLAVE, rubro);
    }, [rubro]);

    const puedeCambiarRubro = plan?.rubros === "AMBOS";

    const cambiarRubro = (nuevoRubro) => {
        if (puedeCambiarRubro) {
            setRubro(nuevoRubro);
        }
    };

    if (!listo) {
        return <div className="text-center mt-5">Cargando...</div>;
    }

    return (
        <RubroContext.Provider
            value={{
                rubro,
                cambiarRubro,
                puedeCambiarRubro,
                plan
            }}
        >
            {children}
        </RubroContext.Provider>
    );
}

export function useRubro() {
    return useContext(RubroContext);
}