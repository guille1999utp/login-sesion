const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {ordenemisor} = require('../controllers/ordenes');
const router = Router();
router.get('/ordenar', validarjwt, ordenemisor);
module.exports = router