const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {pedirproducto } = require('../controllers/productos');

const router = Router();
router.get('/producto/:producto',pedirproducto);
module.exports = router