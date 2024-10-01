import getPool from '../../db/getPool.js';

const selectShiftRecordsService = async (
    typeOfService,
    employeeId,
    startDate,
    endDate
) => {
    const pool = await getPool();

    let sqlQueryDetails = `
        SELECT 
        s.id, s.employeeId, u.firstName, u.lastName, s.clockIn, s.clockOut, se.rating, se.status, se.hours, se.dateTime, a.city, a.address, t.type, t.city AS province,
        TIMESTAMPDIFF(HOUR, s.clockIn, s.clockOut) AS hoursWorked,
        MOD(TIMESTAMPDIFF(MINUTE, s.clockIn, s.clockOut), 60) AS minutesWorked
        FROM shiftRecords s 
        INNER JOIN users u 
        ON u.id = s.employeeId
        INNER JOIN services se 
        ON se.id = s.serviceId
        INNER JOIN addresses a 
        ON a.id = se.addressId
        INNER JOIN typeOfServices t 
        ON t.id = se.typeOfServicesId
        WHERE 1=1
    `;

    let sqlValues = [];

    if (typeOfService) {
        sqlQueryDetails += ' AND t.type = ?';
        sqlValues.push(typeOfService);
    }

    if (employeeId) {
        sqlQueryDetails += ' AND s.employeeId = ?';
        sqlValues.push(employeeId);
    }

    if (startDate && endDate) {
        sqlQueryDetails += ' AND se.dateTime BETWEEN ? AND ?';
        sqlValues.push(startDate, endDate);
    }

    sqlQueryDetails += ' ORDER BY s.modifiedAt DESC';

    const [rowsDetails] = await pool.query(sqlQueryDetails, sqlValues);

    let sqlQueryTotal = `
        SELECT 
        s.employeeId, u.firstName, u.lastName,
        SUM(TIMESTAMPDIFF(HOUR, s.clockIn, s.clockOut)) AS totalHoursWorked,
        SUM(MOD(TIMESTAMPDIFF(MINUTE, s.clockIn, s.clockOut), 60)) AS totalMinutesWorked
        FROM shiftRecords s 
        INNER JOIN users u 
        ON u.id = s.employeeId
        INNER JOIN services se 
        ON se.id = s.serviceId
        INNER JOIN addresses a 
        ON a.id = se.addressId
        INNER JOIN typeOfServices t 
        ON t.id = se.typeOfServicesId
        WHERE 1=1
    `;

    if (typeOfService) {
        sqlQueryTotal += ' AND t.type = ?';
        sqlValues.push(typeOfService);
    }

    if (employeeId) {
        sqlQueryTotal += ' AND s.employeeId = ?';
        sqlValues.push(employeeId);
    }

    if (startDate && endDate) {
        sqlQueryTotal += ' AND se.dateTime BETWEEN ? AND ?';
        sqlValues.push(startDate, endDate);
    }

    sqlQueryTotal += `
        GROUP BY s.employeeId, u.firstName, u.lastName
        ORDER BY totalHoursWorked DESC
    `;

    const [rowsTotal] = await pool.query(sqlQueryTotal, sqlValues);

    return { details: rowsDetails, totals: rowsTotal };
};

export default selectShiftRecordsService;