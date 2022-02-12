const Usuario = require('../models/usuario');
const Mensaje = require('../models/mensaje');
const Ordenproducto = require('../models/ordenar');
const Producto = require('../models/producto');
const cloudinary = require('../utils/cloudinary');
const fetch = require('node-fetch');

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
    const mensajes = await Mensaje.find({ $or : [{de: uid,aparecer:true},{para: uid,aparecer:true}]}).sort({createdAt: 'desc'});
    console.log(mensajes);
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
       await Mensaje.updateMany({productorden:productorden}, {condicion: 'enviado'});
    } catch (error) {
        console.log(error)
    }
}

const cambiarestadochatrecibido = async(productorden) =>{
    try {
     await Mensaje.updateMany({productorden:productorden}, {condicion: 'recibido'});
    } catch (error) {
        console.log(error)
    }
}
const serecibioelproductoconexito = async(productorden,uid,dinero) =>{
    try {
        await Mensaje.deleteMany({productorden:productorden});
        await Ordenproducto.findByIdAndDelete( productorden );
        const res = await Usuario.findById(uid);
        await Usuario.findByIdAndUpdate(uid,{dinerosolicitudes:(parseInt(res.dinerosolicitudes) + parseInt(dinero))});

    } catch (error) {
        console.log(error)
    }
}
const ChatSeleccionadoBorrarNoSeleccionados = async(chat) =>{
    try {
        const intento = await Mensaje.find( { $nor : [{de: chat.de,para: chat.para},{de: chat.para,para: chat.de}]});
        await Mensaje.deleteMany({$and:[{productorden: chat.productorden,$nor : [{de: chat.de,para: chat.para},{de: chat.para,para: chat.de}]}]});         
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

const chatcanceladasolicitud = async(oid) =>{
    try {
        await Ordenproducto.findByIdAndUpdate(oid,{aparecer: true});
        await Mensaje.updateMany({productorden:oid}, {aparecer: false});

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

const userinformarsolicitud = async(Categoria) =>{
    try {
        const usuarios = await Usuario.find({ Categoria });
        let arreglouser = [];
        for (let i = 0; i < usuarios.length; i++) {
            let dato=usuarios[i]._id+''; 

            if(arreglouser.includes(dato)){
            }else{
              arreglouser.push(dato);
            }
        }
        return arreglouser;
      } catch (error) {
       console.log(error);
      }
       
   }
   

const cambiarCategoria = async(Categoria,uid) =>{
    try {
          await Usuario.findByIdAndUpdate(uid,{Categoria})
          
      } catch (error) {
       console.log(error);
      }
       
   }

const subirproductoTodo = async(url,uid,producto) =>{
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

        const procomprado =  await Producto.findById(pid);
        const filtervar = await Usuario.find({ "productosComprados.codigoProducto": codigo });
        const pagodetalles = await fetch(`https://api.mercadopago.com/v1/payments/${codigo}/?access_token=${process.env.ACCESS_TOKEN}`).then(res => res.json());
        if(filtervar.length === 0 && status === 'approved' && procomprado && pagodetalles.status_detail === 'accredited'){
            console.log('entro en producot')
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
        const usuario = await Usuario.findById(uid);
        if( status === 'approved' && usuario.dinerosolicitudes !== 0 && filtervar.length === 0 && pagodetalles.status_detail === 'accredited' ){
            console.log(codigo,)
            console.log('entro en solicitudes')
            await Usuario.findByIdAndUpdate(uid,{
               $addToSet: { productosComprados : {
                   preferences,
                   codigoProducto: codigo,
                   secure_url:'https://res.cloudinary.com/dmgfep69f/image/upload/v1642034441/tu86rbwmkpjsyk3vcvr0.jpg', 
                   titulo: 'LB-SHOP',
                   descripsion: 'Recibo Solicitudes',
                   precio: parseInt(usuario.dinerosolicitudes),
                   status
               } },
               dinerosolicitudes:0
              });

               return usuario._id + "";
        }else{
            console.log('ya existe mai o rechazado mai')
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
             console.log(error);
            return {
                ok:false,
                msg:'No se pudo Borra con exito'
            }
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

            await Mensaje.updateMany( { productorden: oid},{aparecer:false});
            const intento = await Mensaje.find({ productorden: oid});
            console.log(intento+ 'orden');
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
    ChatSeleccionadoBorrarNoSeleccionados,
    cambiarestadochatrecibido,
    serecibioelproductoconexito,
    chatcanceladasolicitud,
    cambiarCategoria,
    userinformarsolicitud
}