const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {solicitudes} = require('../controllers/solicitudes');

const router = Router();
router.get('/solicitudes', validarjwt, solicitudes);
module.exports = router