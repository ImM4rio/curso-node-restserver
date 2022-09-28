// Rutas relacionadas con los usuarios

const { Router } = require('express');
const { usuariosPut, 
        usuariosPost, 
        usuariosGet,
        usuariosDelete,
        usuariosPatch } = require( '../controllers/users' );

const router = Router();

    router.get('/', usuariosGet);

    router.put('/:id', usuariosPut);

    router.post('/', usuariosPost);

    router.delete('/', usuariosDelete);

    router.patch('/', usuariosPatch);



module.exports = router;