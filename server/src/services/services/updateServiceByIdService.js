import getPool from '../../db/getPool.js';

const updateServiceByIdService = async (
    serviceId,
    address,
    postCode,
    city,
    comments,
    date,
    hours,
    startTime
) => {
    const pool = await getPool();

    const [addressId] = await pool.query(
        `
      SELECT addressId FROM services WHERE id = ?`,
        [serviceId]
    );

    await pool.query(
        `
    UPDATE addresses SET address = ?, postCode = ?, city = ?
    WHERE id = ?
    `,
        [address, postCode, city, addressId[0].addressId]
    );

    const [typeId] = await pool.query(
        `
        SELECT typeOfServicesId FROM services WHERE id = ?`,
        [serviceId]
    );

    const [price] = await pool.query(
        `
      SELECT price FROM typeOfServices WHERE id = ?`,
        [typeId[0].typeOfServicesId]
    );

    const resultPrice = price[0].price * hours;

    await pool.query(
        `
        UPDATE services SET comments = ?, date = ?, hours = ?, startTime = ?, totalPrice = ?
        WHERE id = ?
        `,
        [comments, date, hours, startTime, resultPrice, serviceId]
    );
};

export default updateServiceByIdService;
