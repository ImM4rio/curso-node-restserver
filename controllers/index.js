
const auth = require('../controllers/auth')
const buscar = require('../controllers/buscar');
const categorias = require('../controllers/categorias');
const productos = require('../controllers/productos');
const uploads = require('../controllers/uploads')
const usuarios = require('../controllers/usuarios');

module.exports = {
    ...auth,
    ...buscar,
    ...categorias,
    ...productos,
    ...uploads,
    ...usuarios
}