import generateErrorUtil from "../../utils/generateErrorUtil.js";
import insertShiftService from "../../services/shiftRecords/insertShiftService.js";



const insertShiftController = async (req, res, next) => {
    try{

        const isAdmin = req.userLogged.role;

        if(isAdmin != 'admin'){
            generateErrorUtil('No tienes permisos suficiente', 401)
        }

        const { serviceId, employeeId, clientId } = req.body;

        if(!serviceId || !employeeId || !clientId){
            generateErrorUtil('faltan campos', 401)
        }

        await insertShiftService(serviceId, employeeId, clientId)

        res.send({
            status: 'ok',
            message: 'Se ha creado el turno correctamente'
        })

    }catch(error){
        next(error)
    }
}

export default insertShiftController;