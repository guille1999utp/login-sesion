const Usuario = require('../models/usuario');
const Mensaje = require('../models/mensaje');
const Ordenproducto = require('../models/ordenar');
const Producto = require('../models/producto');
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
const usuariosactivos = async(uid) =>{
    const mensajes = await Mensaje.find({ $or : [{de: uid},{para: uid}]}).sort({createdAt: 'desc'});
    let arreglouser = [];
    for (let i = 0; i < mensajes.length; i++) {
        let dato1=mensajes[i].de+''; 
        let dato2= mensajes[i].para+'';
        if(arreglouser.includes(dato1)){
        }else{
          arreglouser.push(dato1);
        }
        if(arreglouser.includes(dato2)){
            }else{
               arreglouser.push(dato2);
       
            }
    }
    const usuarioschat = [];
    for (let i = 0; i < arreglouser.length; i++) {
        const usuarios = await Usuario.findById(arreglouser[i]);
         usuarioschat.push( usuarios )
    }
    
    return usuarioschat;
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

const subirproductoTodo = async(url,uid,producto) =>{
    const newproducto = {
        titulo: producto.titulo,
        detalles: {
            Año: producto.Age,
            Categoria: producto.Categoria,
            Ubicaion: producto.Ubicaion,
            DomicilioIncluido: producto.Domicilio,
            Garantia: producto.Garantia
        },
        fotosdescripsion: [url],
        textdescripsion: producto.descripsion
    }
    console.log(newproducto)
    try{
          const producto = new Producto(newproducto);
          await producto.save();
          console.log( producto );
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
        await Usuario.findByIdAndUpdate(uid,{
            urlfoto:url.secure_url,
            uidfoto: url.public_id
        });
      } catch (error) {
       console.log(error);
      }
       
   }
   const agregarfotouser = async(url,uid) =>{
    try {
        await Usuario.findByIdAndUpdate(uid,{
         $addToSet: { fotosdescripsion : {urlfoto:url.secure_url, uidfoto: url.public_id} }  
        });
      } catch (error) {
       console.log(error);
      }
       
   }
   const eliminarfotouser = async({uidfoto,uid}) =>{
    try {
       await Usuario.findOneAndUpdate({_id: uid},{
            $pull:{ fotosdescripsion : {uidfoto: uidfoto}} 
        });
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
    agregarfotouser,
    eliminarfotouser,
    subirproductoTodo
}