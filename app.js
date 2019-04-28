// Requires 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


// inicializar variables
var app = express();

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

//Body-Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Import Routes
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var searchRoutes = require('./routes/searchs');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var pacienteRoutes = require('./routes/paciente');
var obraSocialRoutes = require('./routes/obrasocial');
var estudioRoutes = require('./routes/estudio');


//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/adminGastroDB', (err, res)=>{
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Server Index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Routes
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', searchRoutes);
app.use('/login', loginRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/paciente', pacienteRoutes);
app.use('/obrasocial', obraSocialRoutes);
app.use('/estudio', estudioRoutes);
app.use('/', appRoutes);

// escuchar peticiones
app.listen(3000, ()=> {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});