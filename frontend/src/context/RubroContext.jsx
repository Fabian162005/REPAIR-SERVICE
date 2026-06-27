import { createContext, useContext, useEffect, useState } from "react";

const RubroContext = createContext();

export function RubroProvider({ children }) {

    const [rubro, setRubro] = useState(() => {
        return localStorage.getItem("repairservice_rubro") || "TECNOLOGIA";
    });

    useEffect(() => {
        localStorage.setItem("repairservice_rubro", rubro);
    }, [rubro]);

    const cambiarRubro = (nuevoRubro) => {
        setRubro(nuevoRubro);
    };

    return (
        <RubroContext.Provider
            value={{
                rubro,
                cambiarRubro
            }}
        >
            {children}
        </RubroContext.Provider>
    );
}

export function useRubro() {
    return useContext(RubroContext);
}