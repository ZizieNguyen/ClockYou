import selectServiceByClientIdService from '../../services/services/selectServiceByClientIdService.js';
import generateErrorUtil from '../../utils/generateErrorUtil.js';

const listClientServiceController = async (req, res, next) => {
    try {
        const clientId = req.userLogged.id;

        const { status, city, type } = req.query;

        const data = await selectServiceByClientIdService(
            clientId,
            status,
            city,
            type
        );

        res.send({
            status: 'ok',
            data,
        });
    } catch (error) {
        next(error);
    }
};

export default listClientServiceController;
