// No hace falta, pero así tenemos el intellisense 
const { response, request } = require('express');
const Usuario = require('../models/user');
const bcrypt = require('bcryptjs');

const usuariosGet = (req = request, res = response) => {

    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPut = (req = request, res = response) => {

    const id = req.params.id;

    res.json({
        msg: 'put API controlador',
        id
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
    usuario.password = bcrypt.hashSync( password, salt )

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