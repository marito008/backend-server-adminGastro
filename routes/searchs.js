var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//===============================================
// Busqueda por coleccion
//===============================================
app.get('/coleccion/:tabla/:search', (req, res)=> {
    var tabla = req.params.tabla;
    var busqueda = req.params.search;
    var regex = new RegExp(busqueda, 'i');

    switch(tabla) {
        case 'usuarios':
            promesa = searchUsuarios(busqueda, regex);
            break;
        case 'hospitales':
            promesa = searchHospitales(busqueda, regex);
            break;
        case 'medicos':
            promesa = searchMedicos(busqueda, regex);
            break;
        default:
            return  res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda es por Medicos, Usuarios, Hospitales.'
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        })
    })
});


//===============================================
// Busqueda General
//===============================================
app.get('/todo/:search', (req, res, next)=> {
    debugger;
    var busqueda = req.params.search;
    var regex = new RegExp(busqueda, 'i');

    Promise.all( [searchHospitales(busqueda, regex), 
                  searchMedicos(busqueda, regex),
                  searchUsuarios(busqueda, regex)])
    .then( result => {
        res.status(200).json({
            ok: true,
            hospitales: result[0],
            medicos: result[1],
            usuarios: result[2]
        })
    });   
});

function searchHospitales(busqueda, regex) {
    return new Promise ((resolve, reject)=> {
        Hospital.find({nombre: regex})
            .populate('usuario', 'nombre email img')
            .exec((err, hospitales)=>{
            if (err){
                reject('Error al cargar hospitales. ', err);
            } else {
                resolve(hospitales);
            }
        }); 

    });
}

function searchMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos)
                }
            });
    });
}
function searchUsuarios(busqueda, regex) {
    return new Promise ((resolve, reject)=> {
        Usuario.find({}, 'nombre email role img')
            .or([{'nombre': regex}, {'email': regex}])
            .exec((err, usuarios)=>{
                if (err){
                    reject('Error al cargar Usuarios. ', err);
                } else {
                    resolve(usuarios);
                }

            });
            
        }); 
}

module.exports = app;