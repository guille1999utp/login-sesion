const {Router} = require('express');
const {pedirproducto ,informacionAdicional,informacionmostrarcategoria} = require('../controllers/productos');

const router = Router();
router.get('/producto/:producto',pedirproducto);
router.get('/busqueda/:busqueda',informacionAdicional);
router.get('/mostrar/:categoria',informacionmostrarcategoria);

module.exports = router