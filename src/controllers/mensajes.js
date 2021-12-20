const Mensaje = require('../models/mensaje');

const chatemisor = async (req,res) => {
const miId = req.uid;
const mensajesde = req.params.de;
try {
    const last30 = await Mensaje.find({ $or : [{de: miId,para: mensajesde},{de: mensajesde,para: miId}]}).sort({createdAt: 'desc'}).limit(30);
    const mensajes = last30.reverse();
    res.json({
        ok:true,
        mensajes: mensajes
    })
} catch (error) {
    console.log(error)
}
}
module.exports ={
    chatemisor
}