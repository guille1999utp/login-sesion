const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {modificacionPerfil,perfilUsuario} = require('../controllers/perfil');

const router = Router();
router.get('/perfil/:de',perfilUsuario);
router.post('/perfil', validarjwt, modificacionPerfil);
module.exports = router