const {Router} = require('express');
const {pedirproducto ,informacionAdicional} = require('../controllers/productos');

const router = Router();
router.get('/producto/:producto',pedirproducto);
router.get('/busqueda/:busqueda',informacionAdicional);

module.exports = router