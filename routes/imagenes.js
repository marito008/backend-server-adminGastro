var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

// Routes
app.get('/:tipo/:img', (req, res, next)=> {

    var tipo = req.params.tipo;
    var imagen = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${imagen}` );

    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);

    } else {
        var pathNoImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImagen);

    }

    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Peticion realizada correctamente'
    // })
});

module.exports = app;