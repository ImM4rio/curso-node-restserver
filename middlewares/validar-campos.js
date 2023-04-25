const { validationResult } = require( 'express-validator' );


// Como es un middleware tiene parámetro next (si alcanza este punto continúa al siguiente controlador)
const validarCampos = ( req, res, next ) => {
        
    const errors = validationResult(req);

    if( !errors.isEmpty() ) {
        return res.status(400).json( errors );
    }

    next();
}

module.exports = {
    validarCampos
}