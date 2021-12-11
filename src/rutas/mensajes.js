const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {chatemisor} = require('../controllers/mensajes');
const router = Router();
router.get('/chat/:de', validarjwt, chatemisor);
module.exports = router