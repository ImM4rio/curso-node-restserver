const Role = require( '../models/role' );
const Usuario = require( '../models/user' );


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

module.exports = {
    esRoleValido,
    emailExiste
}