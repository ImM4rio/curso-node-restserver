const express = require('express')
const cors = require('cors');
const { dbConnection } = require( '../database/config' );


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
    
        // Conectar a base de datos
        this.conectarDB()

        // Middlewares: función que va a ejecutarse cuando levantemos nuestro servidor
        this.middlewares();

        // Rutas de mi aplicación.
        this.routes();
    
    }

    async conectarDB() {
        await dbConnection()
    }

    middlewares () {
        
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() ); 

        // Directorio público
        this.app.use( express.static('public') );        


    }

    routes () {
        
        // Con el middleware esto ya no existe "/" ya que usa la carpeta public, por lo que deberemos especificar una ruta distinta /hello
        this.app.get('/hello',(req, res) => {
            res.send('Hello World')
        
        });

        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }

    listen () {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;