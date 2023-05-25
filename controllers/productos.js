// Mismos nombres que en categorías

const { response } = require( "express" );
const { Producto, Categoria } = require( "../models" );

const crearProducto = async( req, res = response ) => {


    const { estado, usuario, ...body } = req.body;

    const nombre = body.nombre.toUpperCase();
    const categoria = body.categoria.toUpperCase();

    const [ productoDB, categoriaDB ] = await Promise.all(
        [
            Producto
                .findOne({ nombre })
                .populate({
                    path: 'usuario',
                    select: 'nombre corre -_id'
                }),
            Categoria
                .findById( categoria )
        ]
    );

    if( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ nombre } ya existe`
        });
    }

    if( !categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB } no existe`
        })
    }

    const data = {
        nombre,
        categoria: categoriaDB,
        usuario: req.usuario
    }

    const producto = new Producto( data );

    await producto.save();

    res.status(201).json( producto );

}

const productosGet = async ( req, res = response ) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all(
        [
            Producto.countDocuments( query ),
            Producto.find( query )
                .skip( desde )
                .limit( limite )
                .populate({
                    path: 'usuario',
                    select: 'nombre correo -_id'
                })
                .populate( 'categoria' )
        ]
    );

    res.json({
        msg: 'GET - Productos',
        total,
        productos
    });
}

const obtenerProductoPorID = async ( req, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.status(200).json(
        producto
    );
}

const actualizarProducto = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre?.toUpperCase();
    data.usuario = req.usuario;

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true });

    res.status(200).json({
        msg: 'PUT - actualizar registro por ID',
        producto
    });
}

const borrarProducto = async( req, res = response ) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id, {estado: false}, { new: true });

    const usuarioAutenticado = req.usuario;

    res.json({
        msg: 'delete API controlador',
        producto,
        usuarioAutenticado
    });
}


module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProductoPorID,
    productosGet
}