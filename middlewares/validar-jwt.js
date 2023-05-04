const { response, request } = require( 'express' );
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');

const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ){
        return res.status(400).json({
            msg: 'No se ha detectado ningún token en la petición'
        });
    }

    const uid = jwt.verify( token, process.env.SECRETORPRIVATEKEY, ( error, decoded ) => {
        if ( error ) {
            res.status(401).json({
                msg: 'Token no válido'
            });
        } else {
           return decoded.uid
        }
    });
    
    const usuario = await Usuario.findById( uid );

    if ( !usuario ) {
        return res.status(401).json({
            msg: 'Token no válido'
        })
    }

    // Verificar si uid tiene estado true
    if ( !usuario.estado ) {
        return res.status(401).json({
            msg: 'Token no válido'
        })
    }    

    req.usuario = usuario;
    next();
        
}

module.exports = {
    validarJWT
}