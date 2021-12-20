const Ordenproducto = require('../models/ordenar');

const ordenemisor = async (req,res) => {
const miId = req.uid;
try {
    const producto = await Ordenproducto.find( {de: miId }).sort({createdAt: 'desc'});
    res.json({
        ok:true,
        producto
    })
} catch (error) {
    console.log(error)
}
}

module.exports ={
    ordenemisor
}