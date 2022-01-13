const Ordenproducto = require('../models/ordenar');
const Producto = require('../models/producto');

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

const crearproducto = async (req,res) => {
    const miId = req.uid;
    try {
        const producto = await Producto.find( {de: miId });
        const productos = producto.reverse();
        res.json({
            ok:true,
            producto:productos
        })
    } catch (error) {
        console.log(error)
    }
    }

    
const productosUserMostrar = async (req,res) => {
    const miId = req.params.user;
    try {
        const producto = await Producto.find( {de: miId }).limit(20);
        console.log(producto)
        res.json({
            ok:true,
            producto:producto
        })
    } catch (error) {
        console.log(error)
    }
    }
    
    
    

module.exports ={
    ordenemisor,
    crearproducto,
    productosUserMostrar
}