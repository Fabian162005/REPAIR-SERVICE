import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  crearCliente,
  actualizarCliente
} from "../../../services/clienteService";

const ClienteModal = ({
  onClose,
  clienteEditar,
  onSuccess
}) => {

    const [form, setForm] = useState({
  tipo_documento: "DNI",
  numero_documento: "",
  nombres: "",
  apellidos: "",
  razon_social: "",
  celular: "",
  correo: "",
  direccion: "",
  distrito: "",
  ciudad: "",
  observaciones: "",
});

useEffect(() => {

  if (clienteEditar) {

    setForm({
      tipo_documento: clienteEditar.tipo_documento || "DNI",
      numero_documento: clienteEditar.numero_documento || "",
      nombres: clienteEditar.nombres || "",
      apellidos: clienteEditar.apellidos || "",
      razon_social: clienteEditar.razon_social || "",
      celular: clienteEditar.celular || "",
      correo: clienteEditar.correo || "",
      direccion: clienteEditar.direccion || "",
      distrito: clienteEditar.distrito || "",
      ciudad: clienteEditar.ciudad || "",
      observaciones: clienteEditar.observaciones || "",
    });

  }

}, [clienteEditar]);

const handleGuardar = async () => {

  try {

    if (clienteEditar) {

      await actualizarCliente(
        clienteEditar.id,
        form
      );

      Swal.fire({
        icon: "success",
        title: "Cliente actualizado"
      });

    } else {

      await crearCliente(form);

      Swal.fire({
        icon: "success",
        title: "Cliente creado"
      });

    }

    onSuccess();

    onClose();

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo guardar"
    });

  }

};

  return (

    <div
      className="modal d-block"
      style={{
        background: "rgba(0,0,0,0.5)"
      }}
    >

      <div className="modal-dialog modal-lg">

        <div className="modal-content">

          <div className="modal-header">

            <h5>
            {clienteEditar
                ? "Editar Cliente"
                : "Nuevo Cliente"}
            </h5>

            <button
              className="btn-close"
              onClick={onClose}
            />

          </div>

          <div className="modal-body">

            <div className="row g-3">

              <div className="col-md-3">
                <label>Tipo Documento</label>
                    <select
                    className="form-control"
                    value={form.tipo_documento}
                    onChange={(e) =>
                        setForm({
                        ...form,
                        tipo_documento: e.target.value
                        })
                    }
                    >
                    <option>DNI</option>
                  <option>RUC</option>
                </select>
              </div>

              <div className="col-md-3">
                <label>N° Documento</label>
                <input
                className="form-control"
                value={form.numero_documento}
                onChange={(e) =>
                    setForm({
                    ...form,
                    numero_documento: e.target.value
                    })
                }
                />
              </div>

              <div className="col-md-3">
                <label>Nombres</label>
                <input
                className="form-control"
                value={form.nombres}
                onChange={(e) =>
                    setForm({
                    ...form,
                    nombres: e.target.value
                    })
                }
                />
              </div>

              <div className="col-md-3">
                <label>Apellidos</label>
                <input
                className="form-control"
                value={form.apellidos}
                onChange={(e) =>
                    setForm({
                    ...form,
                    apellidos: e.target.value
                    })
                }
                />
              </div>

              <div className="col-md-6">
                <label>Razón Social</label>
                <input
                className="form-control"
                value={form.razon_social}
                onChange={(e) =>
                    setForm({
                    ...form,
                    razon_social: e.target.value
                    })
                }
                />
              </div>

              <div className="col-md-3">
                <label>Celular</label>
                <input
                className="form-control"
                value={form.celular}
                onChange={(e) =>
                    setForm({
                    ...form,
                    celular: e.target.value
                    })
                }
                />
              </div>

              <div className="col-md-3">
                <label>Correo</label>
                <input
                className="form-control"
                value={form.correo}
                onChange={(e) =>
                    setForm({
                    ...form,
                    correo: e.target.value
                    })
                }
                />
              </div>

              <div className="col-md-4">
                <label>Dirección</label>
                <input
                className="form-control"
                value={form.direccion}
                onChange={(e) =>
                    setForm({
                    ...form,
                    direccion: e.target.value
                    })
                }
                />
              </div>

               <div className="col-md-4">
                <label>Departamento</label>
                <input
                className="form-control"
                value={form.ciudad}
                onChange={(e) =>
                    setForm({
                    ...form,
                    ciudad: e.target.value
                    })
                }
                />
              </div>

              <div className="col-md-4">
                <label>Distrito</label>
                <input
                className="form-control"
                value={form.distrito}
                onChange={(e) =>
                    setForm({
                    ...form,
                    distrito: e.target.value
                    })
                }
                />
              </div>

              <div className="col-12">
                <label>Observaciones</label>
               <textarea
                rows="3"
                className="form-control"
                value={form.observaciones}
                onChange={(e) =>
                    setForm({
                    ...form,
                    observaciones: e.target.value
                    })
                }
                />
              </div>

            </div>

          </div>

          <div className="modal-footer">

            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

         <button
        className="btn btn-primary"
        onClick={handleGuardar}
        >
        {
            clienteEditar
            ? "Actualizar"
            : "Guardar"
        }
        </button>


          </div>

        </div>

      </div>

    </div>

  );

};

export default ClienteModal;