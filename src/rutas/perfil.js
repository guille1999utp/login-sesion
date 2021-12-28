const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {modificacionPerfil,perfilUsuario,miperfil} = require('../controllers/perfil');

const router = Router();
router.get('/perfil/:de',perfilUsuario);
router.get('/perfil',validarjwt,miperfil);
router.post('/perfil', validarjwt, modificacionPerfil);
module.exports = router