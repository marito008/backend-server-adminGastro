var express = require('express');

var mdAuthentication = require('../middlewares/authentication'); 

var app = express();
var Medico = require('../models/medico');

//==============================================
// Obtener todos los Medicos.
//==============================================
app.get('/', (req, res, next)=> {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos)=> {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los medicos.',
                    errors: err
                });
            }
    
            Medico.count({}, (err, conteo)=> {
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });
            });
        }); 
});

//==============================================
// Crear un nuevo medico.
//==============================================
app.put('/:id', mdAuthentication.verificarToken, (req,res)=> {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico.',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con id ' + id + ' no existe.',
                errors: {mesagge: 'No existe un medico con ese id.'}
            });
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado)=> {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });            
    
        });
    });  
});

//==============================================
// Crear un nuevo medico.
//==============================================
app.post('/', mdAuthentication.verificarToken, (req, res, next)=> {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado)=> {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico.',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    }); 
});

//==============================================
// Eliminar medico por id.
//==============================================
app.delete('/:id', mdAuthentication.verificarToken, (req,res)=> {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado)=> {
        if (err){
            return res.status(500).json({
                ok: false,
                mesagge: 'Error al eliminar el medico',
                errors: err
            });
        }

        if (!medicoEliminado){
            return res.status(400).json({
                ok: false,
                mesagge: 'No existe un medico con ese id.',
                errors: {mesagge: 'No existe un medico con ese id.'}
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoEliminado            
        });
    });
});

module.exports = app;