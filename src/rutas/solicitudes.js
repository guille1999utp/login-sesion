const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {solicitudes,consultarpagos} = require('../controllers/solicitudes');

const router = Router();
router.post('/solicitudes', validarjwt, solicitudes);
router.get('/consultarpago/:id', validarjwt, consultarpagos);
module.exports = router