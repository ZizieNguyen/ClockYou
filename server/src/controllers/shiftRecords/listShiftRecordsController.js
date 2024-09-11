import generateErrorUtil from '../../utils/generateErrorUtil.js';
import getShiftRecordsService from '../../services/shiftRecords/getShiftRecordsService.js';

const listShiftRecordsController = async (req, res, next) => {
    try {
        const { serviceId, employeeId } = req.query;

        const data = await getShiftRecordsService(
            serviceId,
            employeeId,
            firstName,
            lastName,
            city,
            address,
            type,
            totalPrice
        );

        if (!data.length) generateErrorUtil('No existen datos', 409);

        res.send({
            status: 'ok',
            data,
        });
    } catch (error) {
        next(error);
    }
};

export default listShiftRecordsController;
