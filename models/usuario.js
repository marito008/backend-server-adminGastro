var mongoose = require('mongoose');
var uniqueValidator  = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos  = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    mesagge: '{VALUE, no es un role valido}'
};

var usuarioShema = new Schema({
    nombre: {type: String, required: [true, 'El nombre de usuario es necesario.'] },
    email: {type: String, unique: true, required: [true, 'El email es necesario.'] },
    password: {type: String, required: [true, 'La contraseña de usuario es necesaria.'] },
    img: {type: String, required: false, default: ''},
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: {type: Boolean, default: false}
});

usuarioShema.plugin(uniqueValidator, {mesagge: '{PATH} debe ser unico.'});
module.exports = mongoose.model('Usuario', usuarioShema);