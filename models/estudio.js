var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var estudioSchema = new Schema({
    tipo: { type: String, required: [true, 'Tipo de estudio.'] },
    asistente: { type: String, required: false },
    observacion: { type: String, required: true },
    fecha: { type: Date, required: true},
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
    // paciente: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true },
    // medico: { type: Schema.Types.ObjectId, ref: 'Medico', required: true }
});

module.exports = mongoose.model('Estudio', estudioSchema);