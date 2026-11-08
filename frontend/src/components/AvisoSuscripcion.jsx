import { useRubro } from "../context/RubroContext";
import useAuthStore from "../store/authStore";

export default function AvisoSuscripcion() {

    const { plan } = useRubro();
    const esAdmin = useAuthStore((s) => s.user?.rol) === "ADMIN";

    if (!esAdmin || !plan || plan.dias_restantes === null || plan.dias_restantes > 7) {
        return null;
    }

    const d = plan.dias_restantes;

    return (
        <div className="alert alert-warning mb-3">
            {d <= 0
                ? "Tu suscripción vence hoy."
                : `Tu suscripción vence en ${d} día${d === 1 ? "" : "s"}.`}
            {" "}Contacta al proveedor para renovarla.
        </div>
    );
}