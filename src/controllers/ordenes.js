const Ordenproducto = require('../models/ordenar');
const cloudinary = require('../utils/cloudinary');

const ordenemisor = async (req,res) => {
const miId = req.uid;
try {
    const producto = await Ordenproducto.find( {de: miId });
    const productos = producto.reverse();
    res.json({
        ok:true,
        producto:productos
    })
} catch (error) {
    console.log(error)
}
}

const eliminarfoto = async (req,res) => {
    const foto = req.header('idfoto');
    try {
       const resf = await cloudinary.cloudinary.uploader.destroy(foto, {type : 'upload', resource_type : 'image'},  results =>{
           return results
       });
        res.json(resf)
    } catch (error) {
        console.log(error)
    }
    }

module.exports ={
    ordenemisor,
    eliminarfoto
}