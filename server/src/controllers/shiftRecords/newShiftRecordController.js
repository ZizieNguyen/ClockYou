import Joi from 'joi';

import generateErrorUtil from '../../utils/generateErrorUtil.js';
import insertShiftRecordService from '../../services/shiftRecords/insertShiftRecordService.js';

const newShiftRecordController = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            serviceId: Joi.string().length(36),
            employeeId: Joi.string().length(36),
            clientId: Joi.string().length(36),
        });

        const validation = schema.validate(req.params);

        if (validation.error) {
            generateErrorUtil(validation.error.message, 401);
        }

        const { serviceId, employeeId, clientId } = req.body;

        await insertShiftRecordService(serviceId, employeeId, clientId);

        res.send({
            status: 'ok',
            message: 'Se ha creado el turno correctamente',
        });
    } catch (error) {
        next(error);
    }
};

export default newShiftRecordController;
