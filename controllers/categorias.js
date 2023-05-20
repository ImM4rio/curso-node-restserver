const { response } = require( "express" );
const { Categoria, Usuario } = require ( "../models" );

// obtenerCategorias - paginado - total - populate? (último usuario que ha modif el registro)

const categoriasGet = async ( req, res = response ) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all(
        [
            Categoria.countDocuments( query ),
            Categoria.find( query )
                .skip( desde )
                .limit( limite )
                .populate({
                    path: 'usuario',
                    select: 'nombre correo -_id'
                })
        ]
    );

    res.json({
        msg: 'GET - categoría por ID',
        total,
        categorias
    });
}


const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria
        .findOne({ nombre })
        .populate( 'usuario ');

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ nombre }, ya existe.`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    // Guardar DB
    await categoria.save()

    res.status(201).json( categoria );
}

// actualizarCategoria

const actualizarCategoria = async( req, res = response ) => {

    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();
    const { _id, ...usuario} = req.usuario._doc;
    console.log(usuario)

    if( !usuario ) {
        return res.status(400).json({
            msg: `El usuario no existe.`
        });
    }

    if( !usuario.estado ){
        return res.status(400).json({
            msg: `El usuario ${usuario.nombre} está deshabilitado, contacte con el administrador.`
        });
    } 

    const categoria = await Categoria.findByIdAndUpdate( id, { nombre, usuario: _id });

    res.status(200).json({
        msg: 'PUT - actualizar registro por ID',
        categoria
    });
}

// borrarCategoría - estado: false

const borrarCategoria = async( req, res = response ) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id, {estado: false} );

    const usuarioAutenticado = req.usuario;

    res.json({
        msg: 'delete API controlador',
        categoria,
        usuarioAutenticado
    });
}

module.exports = {
    crearCategoria,
    categoriasGet,
    actualizarCategoria,
    borrarCategoria
}