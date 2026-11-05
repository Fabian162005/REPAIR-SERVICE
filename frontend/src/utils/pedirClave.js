import Swal from "sweetalert2";

export default async function pedirClave(
    titulo = "Clave de permiso",
    texto = "Ingresa la clave de permiso del administrador."
) {
    const r = await Swal.fire({
        title: titulo,
        text: texto,
        input: "password",
        inputPlaceholder: "Clave",
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        inputValidator: (v) => !v && "Ingresa la clave",
    });

    return r.isConfirmed ? r.value : null;
}