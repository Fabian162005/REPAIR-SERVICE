import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  obtenerClientes,
  eliminarCliente,
} from "../../../services/clienteService";

import DashboardLayout from "../../../layouts/DashboardLayout";
import ClienteModal from "../components/ClienteModal";

const ClientesPage = () => {

  const [clientes, setClientes] = useState([]);
  const [buscar, setBuscar] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);

  const cargarClientes = async () => {

    try {

      const data = await obtenerClientes(buscar);

      setClientes(data.data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    cargarClientes();

  }, []);

  const handleBuscar = (e) => {

    e.preventDefault();

    cargarClientes();

  };

  const handleEliminar = async (id) => {

    const result = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {

      await eliminarCliente(id);

      await Swal.fire({
        icon: "success",
        title: "Cliente eliminado",
        timer: 1500,
        showConfirmButton: false,
      });

      cargarClientes();

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el cliente",
      });

    }

  };

  return (

    <DashboardLayout>

      <div className="container-fluid">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h2>Clientes</h2>

          <button
            className="btn btn-primary"
            onClick={() => {

                setClienteEditar(null);

                setShowModal(true);

            }}
            >
            Nuevo Cliente
            </button>


        </div>

        <form onSubmit={handleBuscar} className="mb-3">

          <div className="input-group">

            <input
              type="text"
              className="form-control"
              placeholder="Buscar cliente..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />

            <button className="btn btn-dark">
              Buscar
            </button>

          </div>

        </form>

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Documento</th>
                <th>Cliente</th>
                <th>Celular</th>
                <th>Ciudad</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {clientes.map((cliente) => (

                <tr key={cliente.id}>

                  <td>{cliente.id}</td>

                  <td>
                    {cliente.tipo_documento} - {cliente.numero_documento}
                  </td>

                  <td>
                    {cliente.nombres} {cliente.apellidos}
                  </td>

                  <td>{cliente.celular}</td>

                  <td>{cliente.ciudad}</td>

                  <td>

                   <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {

                        setClienteEditar(cliente);

                        setShowModal(true);

                    }}
                    >
                    Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(cliente.id)}
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

     {
  showModal && (

    <ClienteModal
      clienteEditar={clienteEditar}
      onClose={() => {
        setShowModal(false);
        setClienteEditar(null);
      }}
      onSuccess={cargarClientes}
    />

  )
}
    </DashboardLayout>

  );

};

export default ClientesPage;