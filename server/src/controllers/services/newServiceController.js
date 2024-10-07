import Joi from 'joi';

import generateErrorUtil from '../../utils/generateErrorUtil.js';
import insertServiceService from '../../services/services/insertServiceService.js';

const newServiceController = async (req, res, next) => {
    try {
        const schema = Joi.object().keys({
            startDateTime: Joi.date().min('now').required(),
            hours: Joi.number().min(1).max(8).required(),
            comments: Joi.string().max(250).required(),
            address: Joi.string().max(255).required(),
            city: Joi.string().max(40).required(),
            postCode: Joi.string().length(5).required(),
        });

        const validation = schema.validate(req.body);

        if (validation.error) generateErrorUtil(validation.error.message, 401);

        const userId = req.userLogged.id;

        const { typeOfServiceId } = req.params;

        const { startDateTime, hours, comments, address, city, postCode } =
            req.body;

        const data = await insertServiceService(
            typeOfServiceId,
            userId,
            startDateTime,
            hours,
            comments,
            address,
            city,
            postCode
        );

        res.send({
            status: 'ok',
            message:
                'Servicio solicitado correctamente, en cuanto asignemos un empleado recibirá la información en su Correo Eléctronico',
            data,
        });
    } catch (error) {
        next(error);
    }
};

export default newServiceController;
