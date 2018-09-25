var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//==============================================
// Verificar Token.
//==============================================
exports.verificarToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify( token, SEED, (err, decoded)=> {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto.',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();
        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded,

        // });
    });
    
}

//==============================================
// Verificar ADMIN.
//==============================================
exports.verificarAdminRole = function(req, res, next) {
    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - Ud no es administrador.',
            errors: {
                message: 'No es administrador, no puede realizar eso.'
            }
        });        
    }
}

//==============================================
// Verificar ADMIN o mismo Usuario.
//==============================================
exports.verificarAdminOrUsuario = function(req, res, next) {
    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - Ud no es administrador o mismo usuario.',
            errors: {
                message: 'No es administrador o mismo usuario, no puede realizar eso.'
            }
        });        
    }
}
