const Usuario = require('../models/usuario');
const Mensaje = require('../models/mensaje');
const Ordenproducto = require('../models/ordenar');
const cloudinary = require('../utils/cloudinary');

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
 try {
       const producto = new Ordenproducto(solicitud);
       await producto.save();
       return producto;
   } catch (error) {
    console.log(error);
   }
    
}
const actualizarfotoperfil = async(url,uid) =>{
    try {
        const fotoeliminar = await Usuario.findById(uid);
        if(!!fotoeliminar.uidfoto){
            await cloudinary.cloudinary.uploader.destroy(fotoeliminar.uidfoto, {type : 'upload', resource_type : 'image'}, (res)=>{
                return res;
           });
        }
        const usuario = await Usuario.findByIdAndUpdate(uid,{
            urlfoto:url.secure_url,
            uidfoto: url.public_id
        });
      } catch (error) {
       console.log(error);
      }
       
   }
   const agregarfotouser = async(url,uid) =>{
    try {
        const agregarinformacion = await Usuario.findById(uid);
        console.log(agregarinformacion.fotosdescripsion);
        console.log(agregarinformacion);
      } catch (error) {
       console.log(error);
      }
       
   }
const eliminarproducto = async (req,res) => {
    try {
        await Ordenproducto.findByIdAndDelete( req );
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
    eliminarproducto,
    actualizarfotoperfil,
    agregarfotouser
}