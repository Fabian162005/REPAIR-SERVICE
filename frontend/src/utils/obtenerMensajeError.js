export default function obtenerMensajeError(error, porDefecto = "Ocurrió un error inesperado.") {

    const data = error.response?.data;

    // Errores de validación de Laravel: { errors: { campo: ["mensaje"] } }
    if (data?.errors) {
        return Object.values(data.errors).flat().join("\n");
    }

    // Errores de negocio (ej. stock insuficiente): { message: "..." }
    if (data?.message) {
        return data.message;
    }

    return porDefecto;
}