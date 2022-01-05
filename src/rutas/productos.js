const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {pedirproducto ,informacionAdicional} = require('../controllers/productos');

const router = Router();
router.get('/producto/:producto',pedirproducto);
router.put('/producto/:producto',validarjwt,informacionAdicional);
router.get('/busqueda/:busqueda',informacionAdicional);

module.exports = router