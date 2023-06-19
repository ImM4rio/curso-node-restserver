const path =  require( 'path' );
const fs =  require( 'fs' );
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});


const { response } = require( "express" );
const { subirArchivo } = require( "../helpers" );
const { Usuario, Producto } = require( "../models" );

const cargarArchivo = async( req, res = response ) => {

    try {

        const nombre = await subirArchivo( req.files, undefined, 'imgs' );

        res.json({
            nombre
        });

    } catch (error) {
        res.status(400).json({ error });
    }

}

const actualizarImagen = async( req, res = response ) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById( id );

            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto '});

    }

    // Limpiar imágenes previas

    if ( modelo.img ) {
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();


    res.json({
        msg: 'Put - actualizarImagen',
        modelo
    });
}

const actualizarImagenCloudinary = async( req, res = response ) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById( id );

            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto '});

    }

    // Limpiar imágenes previas

    if ( modelo.img ) {
        const result = await cloudinary.uploader.destroy( path.parse( modelo.img ).name );

    }


    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;

    await modelo.save();


    res.json({
        msg: 'Put - actualizarImagen',
        modelo
    });
}

const mostrarImagen = async( req, res = response ) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById( id );

            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto '});

    }

    if ( modelo.img ) {
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

        if ( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen );
        }

        const notFoundPath = path.join( __dirname, '../assets/no-image.jpg');

        res.sendFile( notFoundPath )
    }

}

module.exports = {
    actualizarImagen,
    actualizarImagenCloudinary,
    cargarArchivo,
    mostrarImagen
}