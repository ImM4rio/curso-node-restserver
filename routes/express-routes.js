// Rutas relacionadas con los usuarios

const { Router } = require('express');
const { check } = require( 'express-validator' );
const { usuariosPut, 
        usuariosPost, 
        usuariosGet,
        usuariosDelete,
        usuariosPatch } = require( '../controllers/users' );

const { validarCampos } = require( '../middlewares/validar-campos' );
const { esRoleValido, emailExiste } = require( '../helpers/db-validators' );

const router = Router();

    router.get('/', usuariosGet);

    router.put('/:id', usuariosPut);

    router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe tener más de 6 caracteres').isLength({ min: 6 }),
        check('correo', 'El correo no es válido').isEmail(),
        check( 'correo' ).custom( emailExiste ),
        // check('rol', 'No es un rol permitido').isIn([ 'ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom( esRoleValido ),
        validarCampos
    ], usuariosPost);

    router.delete('/', usuariosDelete);

    router.patch('/', usuariosPatch);



module.exports = router;