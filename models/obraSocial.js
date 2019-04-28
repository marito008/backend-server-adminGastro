var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var obraSocialSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    estado: {type: Boolean, required: false, default: true },
    user_insert: {type: String, required: false, default: 'admin_user'},
    fecha_insert: {type: Date, required: false, default: new Date()}
}, { collection: 'obraSociales' });


module.exports = mongoose.model('ObraSocial', obraSocialSchema);