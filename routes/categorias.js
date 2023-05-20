const { Router, request, response } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require( '../middlewares' );
const { crearCategoria, categoriasGet, actualizarCategoria, borrarCategoria } = require( '../controllers/categorias' );
const { existeCategoriaPorID } = require( '../helpers/db-validators' );

const router = Router();

// Obtener todas las categorías - public
router.get( '/', 
    categoriasGet
);

// Obtener una categoría - public
router.get( '/:id', [
    check('id').custom( existeCategoriaPorID ),
    validarCampos
    ], categoriasGet
);

// Crear una categoría - private - cualquier persona con un token válido
router.post( '/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
        validarCampos
    ],crearCategoria
);

// Actualizar registro por id - privado - cualquiera con un token válido
router.put( '/:id', [
    validarJWT,
    check('id', 'El ID tiene que ser un MongoID').isMongoId(),
    check('id').custom( existeCategoriaPorID ),
    tieneRole('ADMIN_ROLE'),
    validarCampos
    ], actualizarCategoria
);

// Borrar categoria por id - privado - admin
router.delete(  '/:id', [
    validarJWT,
    check('id', 'El ID tiene que ser un MongoID').isMongoId(),
    check('id').custom( existeCategoriaPorID ),
    tieneRole('ADMIN_ROLE'),
    validarCampos
    ], borrarCategoria
);









module.exports = router;