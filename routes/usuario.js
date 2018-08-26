var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuthentication = require('../middlewares/authentication'); 

var app = express();
var Usuario = require('../models/usuario');

//==============================================
// Obtener todos los usuarios.
//==============================================
app.get('/', (req, res, next)=> {
    Usuario.find({}, 'nombre email img role')
        .exec((err, usuarios)=> {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los usuarios.',
                    errors: err
                });
            }
    
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        }); 
});

//==============================================
// Crear un nuevo usuario.
//==============================================
app.put('/:id', mdAuthentication.verificarToken, (req,res)=> {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario.',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con id ' + id + ' no existe.',
                errors: {mesagge: 'No existe un usuario con ese id.'}
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado)=> {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });            
    
        });
    });  
});

//==============================================
// Crear un nuevo usuario.
//==============================================
app.post('/', mdAuthentication.verificarToken, (req, res, next)=> {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado)=> {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario.',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    }); 
});

//==============================================
// Eliminar usuario por id.
//==============================================
app.delete('/:id', mdAuthentication.verificarToken, (req,res)=> {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado)=> {
        if (err){
            return res.status(500).json({
                ok: false,
                mesagge: 'Error al eliminar el usuario',
                errors: err
            });
        }

        if (!usuarioEliminado){
            return res.status(400).json({
                ok: false,
                mesagge: 'No existe un usuario con ese id.',
                errors: {mesagge: 'No existe un usuario con ese id.'}
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado            
        });
    });
});

module.exports = app;