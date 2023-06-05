
const auth = require('../controllers/auth')
const buscar = require('../controllers/buscar');
const categorias = require('../controllers/categorias');
const productos = require('../controllers/productos');
const usuarios = require('../controllers/usuarios');

module.exports = {
    ...auth,
    ...buscar,
    ...categorias,
    ...productos,
    ...usuarios
}