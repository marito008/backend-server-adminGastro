var express = require('express');

var app = express();

var ObraSocial = require('../models/obraSocial');

// Routes
app.get('/', (req, res, next)=> {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    ObraSocial.find({})
        .skip(desde)
        .limit(5)
        // .populate('paciente', 'nombre apellido dni email')
        // .populate('hospital')
        .exec((err, obraSocial)=> {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los obra social.',
                    errors: err
                });
            }
    
            ObraSocial.count({}, (err, conteo)=> {
                res.status(200).json({
                    ok: true,
                    obraSocial: obraSocial,
                    total: conteo
                });
            });
        }); 
});

//==============================================
// Crear una nueva obra social.
//==============================================
app.post('/',(req, res, next)=> {
    var body = req.body;

    var obraSocial = new ObraSocial({
        nombre: body.nombre
    });

    obraSocial.save((err, obraSocialGuardado)=> {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear obra social.',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            obraSocial: obraSocialGuardado
        });
    }); 
});

module.exports = app;