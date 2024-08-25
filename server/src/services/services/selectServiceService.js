import getPool from '../../db/getPool.js';

const selectServiceService = async (status) => {
    const pool = await getPool();

    if (!status) {
        const [services] = await pool.query(
            `
            SELECT s.status AS Estado, s.id AS serviceId, t.id AS typeOfServiceId, 
            u.id AS clientId, a.id AS addressId, s.createdAt AS Creación, 
            t.type AS Tipo_Servicio, t.city AS Provincia, t.price AS Precio, 
            s.hours AS Horas, s.totalPrice AS Precio_Total, s.date AS Fecha, 
            s.startTime AS Hora_Inicio, a.city AS Ciudad, a.address AS Dirección, a.postCode AS CP, 
            s.totalPrice AS Precio_Total, u.firstName AS Nombre, u.lastName AS Apellidos, 
            u.phone AS Teléfono, u.dni AS DNI, s.comments AS Comentarios
            FROM addresses a
            INNER JOIN services s
            ON a.id = s.addressId
            INNER JOIN users u
            ON u.id = s.clientId
            INNER JOIN typeOfServices t
            ON s.typeOfServicesId = t.id AND s.deletedAt IS NULL
            ORDER BY s.date, s.startTime
          `
        );

        return services;
    }

    const [services] = await pool.query(
        `
        SELECT s.status AS Estado, s.id AS serviceId, t.id AS typeOfServiceId, 
        u.id AS clientId, a.id AS addressId, s.createdAt AS Creación, 
        t.type AS Tipo_Servicio, t.city AS Provincia, t.price AS Precio, 
        s.hours AS Horas, s.totalPrice AS Precio_Total, s.date AS Fecha, 
        s.startTime AS Hora_Inicio, a.city AS Ciudad, a.address AS Dirección, a.postCode AS CP, 
        s.totalPrice AS Precio_Total, u.firstName AS Nombre, u.lastName AS Apellidos, 
        u.phone AS Teléfono, u.dni AS DNI, s.comments AS Comentarios
        FROM addresses a
        INNER JOIN services s
        ON a.id = s.addressId
        INNER JOIN users u
        ON u.id = s.clientId
        INNER JOIN typeOfServices t
        ON s.typeOfServicesId = t.id
        WHERE s.status = ? AND s.deletedAt IS NULL
        ORDER BY s.date, s.startTime
      `,
        [status]
    );

    return services;
};

export default selectServiceService;
