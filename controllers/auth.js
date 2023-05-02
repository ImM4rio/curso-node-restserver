const { response, request } = require('express')

const login = ( request, response ) => {
    response.json({
        msg: 'Login Ok'
    })
}

module.exports = {
    login
}