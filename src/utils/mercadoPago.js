const mercadopago = require("mercadopago");
require("dotenv").config();
// Crea un objeto de preferencia

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});

module.exports = {
    mercadopago
} 