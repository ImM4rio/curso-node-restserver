// Rutas relacionadas con los usuarios

const { Router } = require('express');
const { usuariosPut, 
        usuariosPost, 
        usuariosGet,
        usuariosDelete,
        usuariosPatch } = require( '../controllers/users' );
const { check } = require( 'express-validator' );

const router = Router();

    router.get('/', usuariosGet);

    router.put('/:id', usuariosPut);

    router.post('/', [
        check('correo', 'El correo no es válido').isEmail()
    ], usuariosPost);

    router.delete('/', usuariosDelete);

    router.patch('/', usuariosPatch);



module.exports = router;