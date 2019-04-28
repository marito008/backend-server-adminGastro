var express = require('express');
var mdAuthentication = require('../middlewares/authentication'); 
var app = express();

var Paciente = require('../models/paciente');

//==============================================
// Obtener todos los Pacientes.
//==============================================
app.get('/', (req, res, next)=> {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Paciente.find({})
        // .skip(desde)
        // .limit(5)
        // .populate('ObraSocial', 'nombre')
        .populate('obraSocial')
        .exec((err, pacientes)=> {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los pacientes.',
                    errors: err
                });
            }
    
            Paciente.countDocuments({}, (err, conteo)=> {
                res.status(200).json({
                    ok: true,
                    pacientes: pacientes,
                    total: conteo
                });
            });
        }); 
});

//==============================================
// Obtener paciente por id.
//==============================================
app.get('/:id', (req,res)=> {
    var id = req.params.id;

    Paciente.findById(id)
        .populate('obrasocial', 'nombre')
        // .populate('hospital')
        .exec((err, paciente) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar paciente.',
                    errors: err
                });
            }
    
            if (!paciente) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El paciente con id ' + id + ' no existe.',
                    errors: {mesagge: 'No existe un paciente con ese id.'}
                });
            }

            res.status(200).json({
                ok: true,
                paciente: paciente
            });
        });
});

//==============================================
// Actualizar Paciente.
//==============================================
app.put('/:id', mdAuthentication.verificarToken, (req,res)=> {
    var id = req.params.id;
    var body = req.body;

    Paciente.findById(id, (err, paciente)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico.',
                errors: err
            });
        }

        if (!paciente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El paciente con id ' + id + ' no existe.',
                errors: {mesagge: 'No existe un paciente con ese id.'}
            });
        }
        paciente.nombre = body.nombre;
        paciente.apellido = body.apellido;
        paciente.dni = body.dni;
        paciente.fechaNac = body.fechaNac;
        paciente.obraSocial = body.obraSocial;
        paciente.sexo = body.sexo;

        paciente.save((err, pacienteGuardado)=> {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el paciente.',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: pacienteGuardado
            });            
    
        });
    });  
});

//==============================================
// Crear un nuevo paciente.
//==============================================
app.post('/', mdAuthentication.verificarToken, (req, res, next)=> {
    var body = req.body;
    console.log('Llegoo!!', body);
    var paciente = new Paciente({
        nombre: body.nombre,
        apellido: body.apellido,
        dni: body.dni,
        fechaNac: body.fechaNac,
        obraSocial: body.obrasocial,
        sexo: body.sexo
    });
    
    paciente.save((err, pacienteGuardado)=> {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear paciente.',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            paciente: pacienteGuardado
        });
    }); 
});

module.exports = app;