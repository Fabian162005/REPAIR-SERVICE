import axios from "../../../api/axios";

export const subirArchivoOrden = (
    formData
) => {

    return axios.post(
        "/orden-archivos",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );
};

export const eliminarArchivoOrden =
(id) => {

    return axios.delete(
        `/orden-archivos/${id}`
    );
};