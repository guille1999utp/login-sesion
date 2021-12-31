const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {ordenemisor,crearproducto} = require('../controllers/ordenes');

const router = Router();
router.get('/ordenar', validarjwt, ordenemisor);
router.get('/crearproducto', validarjwt, crearproducto);
module.exports = router