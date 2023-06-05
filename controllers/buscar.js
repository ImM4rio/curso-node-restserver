const { response } = require( 'express');
const { isValidObjectId } = require('mongoose');
const { Usuario, Categoria, Producto } = require( '../models' );

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscarUsuarios = async ( termino = '', res = response ) => {

    const esMongoID = isValidObjectId( termino );

    if ( esMongoID ) {
        const usuario = await Usuario.findById( termino );

        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }


    const regexp = new RegExp( termino, 'i');
    const pipeline = { 
        $or: [
            { nombre: regexp },
            { correo: regexp }
        ],
        $and: [
            { estado: true }
        ]
        }

    const [ usuarios, total ] = await Promise.all([
            Usuario.find( pipeline ),
            Usuario.count( pipeline )
        ]);

    res.json({
        total,
        results: usuarios
    });

}

const buscarCategorias = async ( termino = "", res = response ) => {

    const esMongoID = isValidObjectId( termino );

    if( esMongoID )  {
        const categoria = await Categoria.findById( termino );

        return res.json({
            results: ( categoria ) ? [ categoria ] : `No se ha encontrado ninguna categoría con este MongoID: ${termino}`
        });
    }

    const regexp = new RegExp( termino, 'i' );
    const pipeline = { 
        $or: [
            { nombre: regexp }
        ],
        $and: [
            { estado: true }
        ]
        }
    const [ categorias, total ] = await Promise.all([
        Categoria.find( pipeline ),
        Categoria.count( pipeline )
    ]);

    res.json({
        total,
        results: ( total !== 0 ) ? categorias : `No se ha encontrado ninguna categoría con el nombre ${termino}`
    })
}


const buscarProductos = async ( termino = "", res = response ) => {
    const esMongoID = isValidObjectId( termino );

    if( esMongoID )  {
        const producto = await Producto.findById( termino );

        return res.json({
            results: ( producto ) ? [ producto ] : `No se ha encontrado ningún producto con este MongoID: ${termino}`
        });
    }

    const regexp = new RegExp( termino, 'i' );
    const pipeline = { 
        $or: [
            { nombre: regexp }
        ],
        $and: [
            { estado: true }
        ]
        }
    const [ productos, total ] = await Promise.all([
        Producto.find( pipeline ).populate( 'categoria usuario', 'nombre' ),
        Producto.count( pipeline )
    ]);

    res.json({
        total,
        results: ( total !== 0 ) ? productos : `No se ha encontrado ningún producto con el nombre ${termino}`
    })
}

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch ( coleccion ) {
        case 'categorias':
            buscarCategorias( termino, res );
            break;

        case 'productos':
            buscarProductos( termino, res );
            break;

        case 'usuarios':
            buscarUsuarios( termino, res );
            break;

        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            });
    }

}

module.exports = {
    buscar
};