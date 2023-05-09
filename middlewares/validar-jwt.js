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

    try{
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        const usuario = await Usuario.findById( uid );

        req.usuario = usuario;
        next();

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

    }catch ( error ) {
        console.log( error );
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
     
}

module.exports = {
    validarJWT
}