const { Categoria, Role, Usuario, Producto } = require( '../models' );


const esRoleValido = async( rol = '' ) => {
    const existeRol = await Role.findOne({ rol });

    if( !existeRol ) {
        throw new Error( `El rol ${ rol } no está registrado en la base de datos` );
    }
}

const emailExiste = async( correo = '' ) => {
    const existeEmail = await Usuario.findOne({ correo });

    if( existeEmail ) {
        throw new Error( 'Este correo ya está registrado' );
    }
}

const existeUsuarioPorID = async( id ) => {
    const existeUsuario = await Usuario.findById( id );

    if( !existeUsuario ) {
        throw new Error(`El id: ${id} no existe`)
    }
}

const existeCategoriaPorID = async( id ) => {
    const existeCategoria = await Categoria.findById( id );

    if( !existeCategoria ) {
        throw new Error(`El id: ${id} no está asignado a ninguna categoría`);
    }

}

const existeProductoPorID = async( id ) => {
    const existeProducto = await Producto.findById( id );

    if( !existeProducto ) {
        throw new Error(`El id: ${id} no está asignado a ningún producto`);
    }

}

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );

    if( !incluida ) {
        throw new Error(`La coleccion ${coleccion} no está permitida - ${colecciones}.`);
    }

    return true;
}

module.exports = {
    coleccionesPermitidas,
    esRoleValido,
    emailExiste,
    existeUsuarioPorID,
    existeCategoriaPorID,
    existeProductoPorID
}