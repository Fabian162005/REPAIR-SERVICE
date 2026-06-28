import { useEffect, useState } from "react";

import {
    createVehiculo,
    updateVehiculo
} from "../services/vehiculoService";

import {
    getClientes
} from "../services/clienteService";

function VehiculoModal({
    show,
    handleClose,
    vehiculo,
    onSuccess
}) {

    const [clientes, setClientes] =
        useState([]);

    const initialForm = {

        cliente_id: "",

        tipo_vehiculo: "Motocicleta",

        placa: "",

        marca: "",

        modelo: "",

        anio: "",

        numero_motor: "",

        numero_chasis: "",

        combustible: "GASOLINA",

        cilindrada: "",

        color: "",

        kilometraje: "",

        observaciones: ""

    };

    const [form, setForm] =
        useState(
            initialForm
        );

    useEffect(() => {

        const cargarClientes =
            async () => {

                try {

                    const res =
                        await getClientes();

                    setClientes(

                        Array.isArray(
                            res.data
                        )

                            ? res.data

                            : res.data.data || []

                    );

                } catch (err) {

                    console.error(
                        err
                    );

                }

            };

        cargarClientes();

    }, []);

    useEffect(() => {

        if (
            vehiculo
        ) {

            setForm({

                ...initialForm,

                ...vehiculo

            });

        }

        else {

            setForm(
                initialForm
            );

        }

    }, [vehiculo]);

    if (!show)
        return null;

    const actualizar = (
        campo,
        valor
    ) => {

        setForm({

            ...form,

            [campo]:
                valor

        });

    };

    const guardar =
        async () => {

            try {

                const payload = {

                    ...form,

                    cliente_id:
                        Number(
                            form.cliente_id
                        ),

                    anio:
                        form.anio
                            ? Number(
                                form.anio
                            )
                            : null,

                    kilometraje:
                        form.kilometraje
                            ? Number(
                                form.kilometraje
                            )
                            : 0

                };

                if (
                    vehiculo?.id
                ) {

                    await updateVehiculo(
                        vehiculo.id,
                        payload
                    );

                }

                else {

                    await createVehiculo(
                        payload
                    );

                }

                await onSuccess();

                handleClose();

            }

            catch (
                err
            ) {

                console.log(
                    err.response?.data
                );

            }

        };

    return (

        <div
        className="modal d-block"
        style={{
        background:
        "rgba(0,0,0,.5)"
        }}
        >

        <div className="modal-dialog modal-xl">

        <div className="modal-content">

        <div className="modal-header">

        <h5>

        {
        vehiculo
        ? "Editar Vehículo"
        : "Nuevo Vehículo"
        }

        </h5>

        <button
        className="btn-close"
        onClick={
        handleClose
        }
        />

        </div>

        <div className="modal-body">

        <div className="row">

        <div className="col-md-6 mb-3">

        <label>

        Cliente

        </label>

        <select
        className="form-select"

        value={
        form.cliente_id
        }

        onChange={(e)=>

        actualizar(
        "cliente_id",
        e.target.value
        )

        }

        >

        <option value="">

        Seleccionar

        </option>

        {

        clientes.map(
        (c)=>(

       <option
        key={c.id}
        value={c.id}
        >

        {`${c.nombres} ${c.apellidos}`}

        </option>

        )
        )

        }

        </select>

        </div>

        <div className="col-md-6 mb-3">

        <label>

        Tipo

        </label>

       <select
        className="form-select"

        value={
        form.tipo_vehiculo
        }

        onChange={(e)=>

        actualizar(
        "tipo_vehiculo",
        e.target.value
        )

        }

        >

        <option value="">

        Seleccionar tipo

        </option>

        <option value="MOTO_LINEAL">

        Motocicleta

        </option>

        <option value="AUTO">

        Auto

        </option>

        <option value="CAMIONETA">

        Camioneta

        </option>

        <option value="CAMION">

        Camión

        </option>

        </select>

        </div>

        </div>

        <div className="row">

        {

        [
        {
        name:"placa",
        label:"Placa"
        },

        {
        name:"marca",
        label:"Marca"
        },

        {
        name:"modelo",
        label:"Modelo"
        },

        {
        name:"anio",
        label:"Año"
        },

        {
        name:"numero_motor",
        label:"Número Motor"
        },

        {
        name:"numero_chasis",
        label:"Número Chasis"
        },

        {
        name:"cilindrada",
        label:"Cilindrada"
        },

        {
        name:"color",
        label:"Color"
        },

        {
        name:"kilometraje",
        label:"Kilometraje"
        }

        ]

        .map((campo)=>(

        <div
        key={campo.name}

        className="col-md-6 mb-3"
        >

        <input

        className="form-control"

        placeholder={
        campo.label
        }

        value={
        form[
        campo.name
        ] || ""
        }

        onChange={(e)=>

        actualizar(

        campo.name,

        e.target.value

        )

        }

        />

        </div>

        ))

        }

        </div>

        <div className="mb-3">

        <label>

        Combustible

        </label>

        <select
        className="form-select"

        value={
        form.combustible
        }

        onChange={(e)=>

        actualizar(
        "combustible",
        e.target.value
        )

        }

        >

        <option>

        GASOLINA

        </option>

        <option>

        DIESEL

        </option>

        <option>

        GLP

        </option>

        <option>

        ELECTRICO

        </option>

        </select>

        </div>

        <div>

        <textarea

        rows="4"

        className="form-control"

        placeholder="Observaciones"

        value={
        form.observaciones
        }

        onChange={(e)=>

        actualizar(
        "observaciones",
        e.target.value
        )

        }

        />

        </div>

        </div>

        <div className="modal-footer">

        <button
        className="btn btn-secondary"

        onClick={
        handleClose
        }

        >

        Cancelar

        </button>

        <button
        className="btn btn-success"

        onClick={
        guardar
        }

        >

        Guardar

        </button>

        </div>

        </div>

        </div>

        </div>

        );

        }

export default VehiculoModal;