import {
deleteVehiculo
} from "../services/vehiculoService";

function EliminarVehiculoModal({
show,
handleClose,
vehiculo,
onSuccess
}) {

if(!show) return null;

const eliminar=async()=>{

await deleteVehiculo(
vehiculo.id
);

onSuccess();

handleClose();

};

return(

        <div
        className="modal d-block"
        style={{
        background:"rgba(0,0,0,.4)"
        }}
        >

        <div className="modal-dialog">

        <div className="modal-content">

        <div className="modal-header">

        <h5>

        Eliminar Vehículo

        </h5>

        </div>

        <div className="modal-body">

        ¿Eliminar vehículo
        <b>

        {" "}
        {vehiculo?.placa}

        </b>

        ?

        </div>

        <div className="modal-footer">

        <button
        className="btn btn-secondary"
        onClick={handleClose}
        >

        Cancelar

        </button>

        <button
        className="btn btn-danger"
        onClick={eliminar}
        >

        Eliminar

        </button>

        </div>

        </div>

        </div>

        </div>

        );

}

export default EliminarVehiculoModal;