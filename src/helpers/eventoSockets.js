const Usuario = require('../models/usuario');
const Mensaje = require('../models/mensaje');
const Ordenproducto = require('../models/ordenar');
const Producto = require('../models/producto');
const cloudinary = require('../utils/cloudinary');

const userconectado = async(uid) =>{
    const usuario = await Usuario.findById(uid);
    usuario.online = true;
    await usuario.save();

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
    return arreglouser;


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

const cambiarestadochat = async(productorden) =>{
    try {
       const res = await Mensaje.updateMany({productorden:productorden}, {condicion: 'enviado'});
       console.log(res);
    } catch (error) {
        console.log(error)
    }
}

const ChatSeleccionadoBorrarNoSeleccionados = async(chat) =>{
    try {
        const intento = await Mensaje.find( { $nor : [{de: chat.de,para: chat.para},{de: chat.para,para: chat.de}]});
        const res = await Mensaje.deleteMany({$and:[{productorden: chat.productorden,$nor : [{de: chat.de,para: chat.para},{de: chat.para,para: chat.de}]}]});         
         let arreglouser = [];
         for (let i = 0; i < intento.length; i++) {
             let dato1=intento[i].de+''; 
             let dato2= intento[i].para+'';
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
              usuarioschat.push( usuarios._id+'' )
         }
         
        return usuarioschat;
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
    console.log(producto)
    const newproducto = {
        de: uid,
        titulo: producto.titulo,
        detalles: {
            Age: producto.Age,
            Categoria: producto.Categoria,
            Ubicaion: producto.Ubicaion,
            DomicilioIncluido: producto.Domicilio,
            Garantia: producto.Garantia,
            Precio: producto.Precio,
            Cantidad: producto.Cantidad
        },
        fotosdescripsion: [url],
        textdescripsion: producto.descripsion
    }
    console.log(newproducto)
    try{
          const producto = new Producto(newproducto);
          await producto.save();
          return producto;
      } catch (error) {
       console.log(error);
      }
       
   }

   const adicionarfotoproducto = async(url,pid) =>{
       try{
            await Producto.findByIdAndUpdate(pid,{
            $addToSet: { fotosdescripsion : {secure_url:url.secure_url, public_id: url.public_id} }  
           });
        } catch (error) {
            console.log(error);
        }
   }

   const adicionarproductocomprado = async(uid, codigo, pid,status,preferences) =>{
    try{
        console.log(codigo,pid,status,preferences)
        const procomprado =  await Producto.findById(pid);
        const filtervar = await Usuario.find({ "productosComprados.codigoProducto": codigo });
        if(filtervar.length === 0 && status === 'approved'){
            console.log('entro');
            await Usuario.findByIdAndUpdate(uid,{
               $addToSet: { productosComprados : {
                   preferences,
                   codigoProducto: codigo,
                   secure_url:procomprado.fotosdescripsion[0], 
                   titulo: procomprado.titulo,
                   descripsion: procomprado.textdescripsion[0],
                   precio: parseInt(procomprado.detalles[0].Precio*1.15)
               } }  
              });
              await Usuario.findByIdAndUpdate(procomprado.de,{
                $addToSet: { productosVendidos : {
                    codigoProducto: codigo,
                    secure_url:procomprado.fotosdescripsion[0], 
                    titulo: procomprado.titulo,
                    descripsion: procomprado.textdescripsion[0],
                    precio: parseInt(procomprado.detalles[0].Precio*1.15),
                    status
                } }  
               });
               return procomprado.de + "";
        }else{
            console.log('ya existe mai')
        }
     } catch (error) {
         console.log(error);
     }
}


   const adicionarParrafoproducto = async(Parrafo,pid) =>{
    try{
        await Producto.findByIdAndUpdate(pid,{
         $addToSet: { textdescripsion : Parrafo }  
        });
     } catch (error) {
         console.log(error);
     }
}

const eliminarparrafoproducto = async(pid,index) =>{
    const eliminar = index-1;
    try{
        const producto =  await Producto.findByIdAndUpdate(pid,{
            $pop: { textdescripsion : eliminar }  
           });
           console.log(producto);
     } catch (error) {
         console.log(error);
     }
}
const eliminarproductocarrito = async(pid,uid) =>{
        try{
            await Usuario.findByIdAndUpdate(uid,{
                $pull: { carrito : pid }  
               });
            return {
                ok:true,
                msg:'se borro correctamente'
            }
         } catch (error) {
            return {
                ok:false,
                msg:'No se pudo Borra con exito'
            }
             console.log(error);
         }
}


   const eliminarfotoproductoadicional = async(url,pid) =>{
    try{
        await Producto.findByIdAndUpdate(pid,{
         $pull: { fotosdescripsion : {public_id: url.public_id} }  
        });

        await cloudinary.cloudinary.uploader.destroy(url.public_id, {type : 'upload', resource_type : 'image'}, (res)=>{
            return res;
       });
     } catch (error) {
         console.log(error);
     }
    }

    const guardarcarritoproducto = async(uid,pid) =>{
        let carrito = []
        try{
            const user = await Usuario.findById(uid);
            carrito = [...user.carrito];
            if( !carrito.includes(pid) ){
                await Usuario.findByIdAndUpdate(uid,{
                 $push: { carrito : pid }  
                });
                return {
                    ok:true,
                    msg: 'Agregado correctamente'
                }
            }else{
                return {
                    ok:false,
                    msg: 'ya esta incluido en el carrito'
                }
            }
         } catch (error) {
             console.log(error);
         }
        }

        const cargarproductoscarrito = async(uid) =>{
            const user = await Usuario.findById(uid);
            const carrito = [...user.carrito];
            let arreglocarrito = [];
                for (let i = 0; i < carrito.length; i++) {
                const produc = await Producto.findById(carrito[i]);
                arreglocarrito.push( produc )
            }
            
            return arreglocarrito;
        }
        
        const cargarproductoscomprados= async(uid) =>{
            const user = await Usuario.findById(uid);
            const compras = [...user.productosComprados];
            return compras.reverse();
        }

        const cargarproductosvendidos= async(uid) =>{
            const user = await Usuario.findById(uid);
            const ventas = [...user.productosVendidos];
            return ventas.reverse();
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
   const eliminarproductouser = async(pid) =>{
    try {
       await Producto.findOneAndDelete({_id: pid});
      } catch (error) {
       console.log(error);
      }
       
   }
   const modificardatosproducto = async(producto,url) =>{
      
    try {
        
       if(url !== null){
        await cloudinary.cloudinary.uploader.destroy(producto.fotosdescripsion[0].public_id, {type : 'upload', resource_type : 'image'}, (res)=>{
            return res;
       });
        producto.fotosdescripsion[0] = {
            secure_url: url.secure_url,
            public_id: url.public_id
        }
    }
       await Producto.findByIdAndUpdate(producto.pid,producto);
      } catch (error) {
       console.log(error);
      }
       
   }
const eliminarproducto = async (oid,idfoto) => {
    try {
            await cloudinary.cloudinary.uploader.destroy(idfoto, {type : 'upload', resource_type : 'image'}, (res)=>{
                return res;
           });
            await Ordenproducto.findByIdAndDelete( oid );
    } catch (error) {
        console.log(error)
    }
    }

    const desactivarproducto = async (oid) => {
        try {
           await Ordenproducto.findByIdAndUpdate(oid,{aparecer: false});
            } catch (error) {
            console.log(error)
        }
        }
module.exports = {
    modificardatosproducto,
    eliminarfotoproductoadicional,
    userconectado,
    userdesconectado,
    usuariosactivos,
    savemessage,
    subirproducto,
    eliminarproducto,
    desactivarproducto,
    actualizarfotoperfil,
    agregarfotouser,
    eliminarfotouser,
    subirproductoTodo,
    eliminarproductouser,
    adicionarfotoproducto,
    eliminarparrafoproducto,
    adicionarParrafoproducto,
    guardarcarritoproducto,
    cargarproductoscarrito,
    eliminarproductocarrito,
    adicionarproductocomprado,
    cargarproductoscomprados,
    cargarproductosvendidos,
    cambiarestadochat,
    ChatSeleccionadoBorrarNoSeleccionados
}