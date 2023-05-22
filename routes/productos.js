const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, productosGet, obtenerProductoPorID, actualizarProducto, borrarProducto } = require( '../controllers/productos' );
const { validarJWT, validarCampos, tieneRole } = require( '../middlewares' );
const { existeProductoPorID } = require( '../helpers/db-validators' );


const router = new Router();

// Obtener todos los productos.
router.get( '/',
    productosGet
);

// Obtener un producto - public
router.get( '/:id', [
    check('id', 'El ID tiene que ser un MongoID').isMongoId(),
    check('id').custom( existeProductoPorID ),
    validarCampos
    ], obtenerProductoPorID
);

// Crear un producto - privado - cualquiera con un token válido
router.post( '/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    validarCampos
], crearProducto
);

// Actualizar registro por id - privado - cualquiera con un token válido
router.put( '/:id', [
    validarJWT,
    check('nombre', 'El nombra es obligarotio').not().isEmpty(),
    tieneRole('ADMIN_ROLE'),
    check('id', 'El ID tiene que ser un MongoID').isMongoId(),
    check('id').custom( existeProductoPorID ),
    validarCampos
    ], actualizarProducto
);

// Borrar producto por id - privado - admin
router.delete( '/:id', [
    validarJWT,
    check('nombre', 'El nombra es obligarotio').not().isEmpty(),
    tieneRole('ADMIN_ROLE'),
    check('id', 'El ID tiene que ser un MongoID').isMongoId(),
    check('id').custom( existeProductoPorID ),
    validarCampos
    ], borrarProducto
);


module.exports = router;