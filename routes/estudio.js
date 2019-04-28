var express = require('express');

var mdAuthentication = require('../middlewares/authentication'); 

var app = express();
var Estudio = require('../models/estudio');

//==============================================
// Obtener todos los Estudios.
//==============================================
app.get('/', (req, res, next)=> {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Estudio.find({})
        .skip(desde)
        .limit(5)
        // .populate('usuario', 'nombre email')
        // .populate('hospital')
        .exec((err, medicos)=> {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los estudio.',
                    errors: err
                });
            }
    
            Estudio.count({}, (err, conteo)=> {
                res.status(200).json({
                    ok: true,
                    estudios: estudio,
                    total: conteo
                });
            });
        }); 
});

//==============================================
// Obtener medico.
//==============================================
// app.get('/:id', (req,res)=> {
//     var id = req.params.id;

//     Medico.findById(id)
//         .populate('usuario', 'nombre email img')
//         .populate('hospital')
//         .exec((err, medico) => {
//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     mensaje: 'Error al buscar medico.',
//                     errors: err
//                 });
//             }
    
//             if (!medico) {
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'El medico con id ' + id + ' no existe.',
//                     errors: {mesagge: 'No existe un medico con ese id.'}
//                 });
//             }

//             res.status(200).json({
//                 ok: true,
//                 medico: medico
//             });
//         });
// });

//==============================================
// Actualizar medico.
//==============================================
// app.put('/:id', mdAuthentication.verificarToken, (req,res)=> {
//     var id = req.params.id;
//     var body = req.body;

//     Medico.findById(id, (err, medico)=> {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al buscar medico.',
//                 errors: err
//             });
//         }

//         if (!medico) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'El medico con id ' + id + ' no existe.',
//                 errors: {mesagge: 'No existe un medico con ese id.'}
//             });
//         }
//         medico.nombre = body.nombre;
//         medico.usuario = req.usuario._id;
//         medico.hospital = body.hospital;

//         medico.save((err, medicoGuardado)=> {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'Error al actualizar el medico.',
//                     errors: err
//                 });
//             }

//             res.status(200).json({
//                 ok: true,
//                 medico: medicoGuardado
//             });            
    
//         });
//     });  
// });

//==============================================
// Crear un nuevo medico.
//==============================================
// app.post('/', mdAuthentication.verificarToken, (req, res, next)=> {
//     var body = req.body;
    
//     var estudio = new Estudio({
//         tipo: body.tipo,
//         asistente: body.asistente,
//         observacion: body.observacion,
//         fecha: body.fecha,
//         usuario: req.usuario._id
//         // hospital: body.hospital
//     });

//     estudio.save((err, estudioGuardado)=> {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'Error al crear estudio.',
//                 errors: err
//             });
//         }
//         res.status(201).json({
//             ok: true,
//             estudio: estudioGuardado
//         });
//     }); 
// });

//==============================================
// Eliminar medico por id.
//==============================================
// app.delete('/:id', mdAuthentication.verificarToken, (req,res)=> {
//     var id = req.params.id;

//     Medico.findByIdAndRemove(id, (err, medicoEliminado)=> {
//         if (err){
//             return res.status(500).json({
//                 ok: false,
//                 mesagge: 'Error al eliminar el medico',
//                 errors: err
//             });
//         }

//         if (!medicoEliminado){
//             return res.status(400).json({
//                 ok: false,
//                 mesagge: 'No existe un medico con ese id.',
//                 errors: {mesagge: 'No existe un medico con ese id.'}
//             });
//         }

//         res.status(200).json({
//             ok: true,
//             medico: medicoEliminado            
//         });
//     });
// });

module.exports = app;