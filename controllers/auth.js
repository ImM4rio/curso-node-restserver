const { res, req, request, response } = require('express')
const Usuario = require('../models/user')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require( '../helpers/generar-jwt' );
const { googleVerify } = require( '../helpers/google-verify' );


const login = async( req, res ) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            })
        }

        // Verificar si el usuario está activo en db
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            })
        }

        // Verificar contraseña by default
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ) {
            return res.status(400).json({
                msg: 'El password no es válido'
            })
        }

        // Generar el JWT
        const token = await generarJWT( usuario._id )

        res.json({ 
            msg: 'Login Ok',
            usuario,
            token
        })


    } catch (error) {
        return res.status(500).json({
            msg: 'Hable con el administrador.'
        });
    }

}

const googleSignIn = async ( req = request, res = response ) => {
    
    const { id_token } = req.body;

    try {
        
        const { correo, nombre, img } = await googleVerify( id_token );
        
        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Crearlo
            const data = {
                nombre,
                correo,
                password: ":P",
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });

        }

        // Generar el JWT
        const token = await generarJWT( usuario._id )

        res.json({
            msg: 'todo ok',
            usuario,
            token
        });

    } catch ( error ) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar',
        })
    }
}

module.exports = {
    login,
    googleSignIn
}