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
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios)=> {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los usuarios.',
                    errors: err
                });
            }
 
            Usuario.count({}, (err, conteo)=> {
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });
            });
        }); 
});

//==============================================
// Actualizar usuario.
//==============================================
app.put('/:id', [mdAuthentication.verificarToken, mdAuthentication.verificarAdminOrUsuario], (req,res)=> {
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
        usuario.apellido = body.apellido;
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
app.post('/', [mdAuthentication.verificarToken, mdAuthentication.verificarAdminRole], (req, res, next)=> {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
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
app.delete('/:id', [mdAuthentication.verificarToken, mdAuthentication.verificarAdminRole], (req,res)=> {
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