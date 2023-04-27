// No hace falta, pero así tenemos el intellisense 
const { response, request } = require('express');
const Usuario = require('../models/user');
const bcrypt = require('bcryptjs');
const { Mongoose } = require( 'mongoose' );

const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [ total, usuarios ] = await Promise.all(
        [ 
            Usuario.countDocuments( query ),
            Usuario.find( query )
                .skip(desde)
                .limit(limite)
        ]
    );

    res.json({
        msg: 'get API controlador',
        total,
        usuarios
    });
}

const usuariosPut = async( req, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    // TODO validar contra base de datos
    if ( password ) {
        // Encriptar pass
        const salt = bcrypt.genSaltSync(); // default 10
        resto.password = bcrypt.hashSync( password, salt );
    }



    const usuario = await Usuario.findByIdAndUpdate( id, resto);

    res.json({
        msg: 'put API controlador',
        usuario
    });
}

const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, password, rol} = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    // // Verificar correo
    // const existeEmail = await Usuario.findOne({ correo });

    // if( existeEmail ) {
    //     return res.status(400).json({
    //         message: 'Ese correo ya está registrado'
    //     })
    // }

    // Encriptar pass
    const salt = bcrypt.genSaltSync(); // default 10
    usuario.password = bcrypt.hashSync( password, salt );

    // Guardar en db
    await usuario.save();

    res.json({
        msg: 'post API controlador',
        usuario
    });

}

const usuariosDelete = (req = request, res = response) => {
    res.json({
        msg: 'delete API controlador'
    });
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete

}