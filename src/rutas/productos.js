const {Router} = require('express');
const {pedirproducto ,informacionAdicional,informacionmostrarcategoria,PagarProducto,FeedBack} = require('../controllers/productos');

const router = Router();
router.get('/producto/:producto',pedirproducto);
router.get('/busqueda/:busqueda',informacionAdicional);
router.get('/mostrar/:categoria',informacionmostrarcategoria);
router.post('/comprar/:id',PagarProducto);
router.get('/', FeedBack);

module.exports = router