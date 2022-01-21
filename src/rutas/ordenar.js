const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {ordenemisor,crearproducto, productosUserMostrar,ordenencontrar} = require('../controllers/ordenes');

const router = Router();
router.get('/ordenar', validarjwt, ordenemisor);
router.post('/ordenconsulta', validarjwt, ordenencontrar);
router.get('/crearproducto', validarjwt, crearproducto);
router.get('/productosdeluser/:user', productosUserMostrar);
module.exports = router