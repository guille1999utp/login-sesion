const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {ordenemisor,eliminarfoto} = require('../controllers/ordenes');

const router = Router();
router.get('/ordenar', validarjwt, ordenemisor);
router.post('/ordenar', eliminarfoto);
module.exports = router