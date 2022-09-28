// No hace falta, pero así tenemos el intellisense 
const { response, request } = require('express');


const usuariosGet = (req = request, res = response) => {

    const { q, nombre = 'No name', apikey } = req.query;

    res.json({
        msg: 'get API controlador',
        q,
        nombre,
        apikey
    });
}

const usuariosPut = (req = request, res = response) => {

    const id = req.params.id;

    res.json({
        msg: 'put API controlador',
        id
    });
}

const usuariosPost = (req = request, res = response) => {
    
    const {nombre, edad} = req = request.body;
    
    res.json({
        msg: 'post API controlador',
        nombre,
        edad
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