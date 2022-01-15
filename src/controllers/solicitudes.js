const Ordenproducto = require('../models/ordenar');

const solicitudes = async (req,res) => {
const miId = req.uid;
const limit = req.header('limit');
try {
    const solicitudes = await Ordenproducto.find( { $nor: [{de:  miId}] }).sort({createdAt: 'desc'}).limit(limit*10);
    res.json({
        ok:true,
        solicitudes
    })
} catch (error) {
    console.log(error)
}
}
const consultarpagos = async (req,res) => {
    const pago = req.params.id;
    const pagodetalles = await fetch(`https://api.mercadopago.com/v1/payments/${pago}/?access_token=${process.env.ACCESS_TOKEN}`,{
        method: "GET"
      });
    try {
        console.log(pagodetalles)
        if(pagodetalles.status !== 404){
            res.json({
                ok:true,
                pagodetalles
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            ok:true,
            msg: 'error al solicitar el pago'
        })
    }
    }

module.exports ={
    solicitudes,
    consultarpagos
}