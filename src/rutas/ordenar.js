const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {ordenemisor,crearproducto, productosUserMostrar} = require('../controllers/ordenes');

const router = Router();
router.get('/ordenar', validarjwt, ordenemisor);
router.get('/crearproducto', validarjwt, crearproducto);
router.get('/productosdeluser/:user', productosUserMostrar);
module.exports = router