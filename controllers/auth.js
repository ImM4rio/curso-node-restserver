const { res, req, request, response } = require('express')
const Usuario = require('../models/user')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require( '../helpers/generar-jwt' );


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

    

    res.json({
        msg: 'todo ok',
        id_token
    })
}

module.exports = {
    login,
    googleSignIn
}