import jwt from 'jsonwebtoken';
import generateErrorUtil from '../utils/generateErrorUtil.js';

import { SECRET } from '../../env.js';


const authUserAdmin = (req,res,next) => {
    try {
        const { authorization } = req.headers

        if(!authorization) generateErrorUtil('Se esperaba un token por encabezado', 401);
        
        let tokenInfo;

        try {
            tokenInfo = jwt.verify(authorization, SECRET);
        } catch (error) {
            generateErrorUtil('Credenciales invalidas', 401);
        }

        if(tokenInfo.role !== "admin"){
            generateErrorUtil('Acceso denegado se requiere rol de Administrador', 401)
        }

        req.userLogged = tokenInfo;

        next();

    } catch (error) {
        next(error);   
    }

}

export default authUserAdmin;