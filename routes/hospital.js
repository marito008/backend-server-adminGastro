var express = require('express');

var mdAuthentication = require('../middlewares/authentication'); 

var app = express();
var Hospital = require('../models/hospital');

//==============================================
// Obtener todos los Hospitales.
//==============================================
app.get('/', (req, res, next)=> {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales)=> {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los hospitales.',
                    errors: err
                });
            }
    
            Hospital.count({}, (err, conteo)=> {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                });
            });
        }); 
});

//==============================================
// Crear un nuevo hospital.
//==============================================
app.put('/:id', mdAuthentication.verificarToken, (req,res)=> {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital.',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con id ' + id + ' no existe.',
                errors: {mesagge: 'No existe un hospital con ese id.'}
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado)=> {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });            
    
        });
    });  
});

//==============================================
// Crear un nuevo hospital.
//==============================================
app.post('/', mdAuthentication.verificarToken, (req, res, next)=> {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado)=> {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital.',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    }); 
});

//==============================================
// Eliminar hospital por id.
//==============================================
app.delete('/:id', mdAuthentication.verificarToken, (req,res)=> {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalEliminado)=> {
        if (err){
            return res.status(500).json({
                ok: false,
                mesagge: 'Error al eliminar el hospital',
                errors: err
            });
        }

        if (!hospitalEliminado){
            return res.status(400).json({
                ok: false,
                mesagge: 'No existe un hospital con ese id.',
                errors: {mesagge: 'No existe un hospital con ese id.'}
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalEliminado            
        });
    });
});

module.exports = app;