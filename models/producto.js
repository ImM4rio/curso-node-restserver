const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    }
})

ProductoSchema.methods.toJSON = function() {
    let { __v, estado, ...producto} = this.toObject();

    producto = {
        ...producto,
        categoria: {
            ...producto.categoria,
            __v: undefined,
        },
            usuario: {
            ...producto.usuario,
            password: undefined,
            estado: undefined,
            __v: undefined
        }
    }

    return producto;
}

module.exports = model( 'Producto', ProductoSchema );