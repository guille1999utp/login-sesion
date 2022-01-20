const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {solicitudes,consultarpagos,consultarpreferences} = require('../controllers/solicitudes');

const router = Router();
router.post('/solicitudes', validarjwt, solicitudes);
router.get('/consultarpago/:id', validarjwt, consultarpagos);
router.post('/consultarpreferences', validarjwt, consultarpreferences);
module.exports = router