const {Router} = require('express');
const {pedirproducto ,informacionAdicional,informacionmostrarcategoria,PagarProducto,FeedBack,PagarServicios} = require('../controllers/productos');
const {validarjwt} = require('../helpers/regenerarjwt');

const router = Router();
router.get('/producto/:producto',pedirproducto);
router.get('/busqueda/:busqueda',informacionAdicional);
router.get('/mostrar/:categoria',informacionmostrarcategoria);
router.post('/comprar/:id',validarjwt,PagarProducto);
router.get('/pagar',validarjwt,PagarServicios);
router.get('/feedback', validarjwt, FeedBack);

module.exports = router