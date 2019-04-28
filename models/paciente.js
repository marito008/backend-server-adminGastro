var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var pacienteShema = new Schema({
    nombre: {type: String, required: [true, 'El nombre del paciente es necesario.'] },
    apellido: {type: String, required: [true, 'El apellido del paciente es necesario.'] },
    dni: {type: String, unique: true, required: [true, 'El DNI del paciente es necesaria.'] },
    fechaNac: {type: Date, required: false},
    sexo: {type: String, required: [true, 'El sexo del paciente es necesario.']},
    obraSocial: { type: Schema.Types.ObjectId, ref: 'ObraSocial', required: [true, 'El id obra social es un campo obligatorio'] },
    user_insert: {type: String, required: false, default: 'admin_user'},
    fecha_insert: {type: Date, required: false, default: new Date()}
    // role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});
module.exports = mongoose.model('Paciente', pacienteShema);