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


module.exports ={
    solicitudes
}