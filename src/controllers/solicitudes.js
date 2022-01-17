const Ordenproducto = require('../models/ordenar');
const fetch = require('node-fetch');
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
    try {
        const pagodetalles = await fetch(`https://api.mercadopago.com/v1/payments/${pago}/?access_token=${process.env.ACCESS_TOKEN}`).then(res => res.json());
        if(pagodetalles.status !== 404){
            res.json({
                ok:true,
                res:pagodetalles
            })
        }else{
            res.status(404).json({
                ok:false,
                msg:'no se encontro el producto'
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