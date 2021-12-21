const Usuario = require('../models/usuario');
const Mensaje = require('../models/mensaje');
const Ordenproducto = require('../models/ordenar');


const userconectado = async(uid) =>{
    const usuario = await Usuario.findById(uid);
    usuario.online = true;
    await usuario.save();
    return usuario;
}
const userdesconectado = async(uid) =>{
    const usuario = await Usuario.findById(uid);
    usuario.online = false;
    await usuario.save();
    return usuario;
}
const usuariosactivos = async() =>{
    const usuarios = await Usuario.find().sort('-online')
    return usuarios;
}
const savemessage = async(mensaje) =>{
    try {
        const mensaj = new Mensaje(mensaje);
        await mensaj.save();
        return mensaj;
    } catch (error) {
        console.log(error)
    }
}
const subirproducto = async(solicitud) =>{
 console.log(solicitud);  
 try {
       const producto = new Ordenproducto(solicitud);
       await producto.save();
       return producto;
   } catch (error) {
    console.log(error);
   }
    
}

const eliminarproducto = async (req,res) => {
    try {
        const producto = await Ordenproducto.findByIdAndDelete( req );
        res.json({
            ok:true,
            producto:producto.oid
        })
    } catch (error) {
        console.log(error)
    }
    }
module.exports = {
    userconectado,
    userdesconectado,
    usuariosactivos,
    savemessage,
    subirproducto,
    eliminarproducto
}