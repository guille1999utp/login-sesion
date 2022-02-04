const {ChatSeleccionadoBorrarNoSeleccionados,chatcanceladasolicitud,cambiarestadochat,serecibioelproductoconexito,cambiarestadochatrecibido, userconectado,desactivarproducto, modificardatosproducto,eliminarfotoproductoadicional,cargarproductosvendidos,cargarproductoscomprados,eliminarproductocarrito,cargarproductoscarrito,adicionarproductocomprado,eliminarparrafoproducto,guardarcarritoproducto, adicionarParrafoproducto,userdesconectado,adicionarfotoproducto, usuariosactivos,savemessage,subirproducto, eliminarproducto,eliminarproductouser, subirproductoTodo,actualizarfotoperfil,agregarfotouser,eliminarfotouser } = require("./helpers/eventoSockets");
const { comprobacionJWT } = require("./helpers/jwt");
const cloudinary = require('./utils/cloudinary');
const {nanoid} = require('nanoid');
class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', async ( socket ) => {
           const [ valido, uid ] = comprobacionJWT(socket.handshake.query['x-token']);
           if(!valido){
               console.log('socket erroneo');
               return socket.disconnect();
           }
          
           const informarActivo = await userconectado(uid);
           for (let i = 0; i < informarActivo.length; i++) {
            const pos = informarActivo[i];
            if(pos !== uid){
            this.io.to(pos).emit('lista-usuarios',await usuariosactivos(pos));
            }
        }
           console.log('cliente conectado')
            
            socket.join( uid );
           
            this.io.to(uid).emit('lista-usuarios',await usuariosactivos(uid));
            this.io.to(uid).emit('lista-carrito',await cargarproductoscarrito(uid));     
            this.io.to(uid).emit('lista-compras',await cargarproductoscomprados(uid));     
            this.io.to(uid).emit('lista-vendidos',await cargarproductosvendidos(uid));     
            //mandar mensajes a los dos chats que se estan conectando
            socket.on('mensaje', async (payload)=>{
               const mensaje = await savemessage(payload);
               this.io.to(payload.para).emit('mensaje',mensaje);
               this.io.to(payload.de).emit('mensaje',mensaje);
               this.io.to(uid).emit('lista-usuarios',await usuariosactivos(uid));
               this.io.to(payload.para).emit('lista-usuarios',await usuariosactivos(payload.para));
            })
           //solicitud del cliente mandada, pide confirmacion de llegada
            socket.on('enviadoproductosolicitud', async ({productorden,de,para})=>{
            await cambiarestadochat(productorden);
            this.io.to(para).emit('recibidoproductosolicitud',de);
            this.io.to(de).emit('recibidoproductosolicitud',para);
            this.io.to(para).emit('estadopendiente');
            this.io.to(de).emit('estadopendiente');
             }) 
             
             //solicitud del cliente recibida,confirmacion de llegada
            socket.on('recibidoproductosolicitud', async ({productorden,de,para})=>{
                await cambiarestadochatrecibido(productorden);
                this.io.to(para).emit('recibidoproductosolicitud',de);
                this.io.to(de).emit('recibidoproductosolicitud',para);
                this.io.to(para).emit('estadorecibido');
                this.io.to(de).emit('estadorecibido');
                 }) 
                 
            //se recibio el producto con total exito
            socket.on('productorecibidoconexito', async ({productorden,de,para,dinero})=>{
                 await serecibioelproductoconexito(productorden,de,dinero);
                 this.io.to(para).emit('resetchat');
                 this.io.to(de).emit('resetchat');
                 this.io.to(para).emit('lista-usuarios',await usuariosactivos(para));
                 this.io.to(de).emit('lista-usuarios',await usuariosactivos(de));

                 }) 
             //seleccionar chat y eliminar las demas solicitudes
             socket.on('seleccionarchat', async (payload)=>{
               const mensaje = await ChatSeleccionadoBorrarNoSeleccionados(payload);
               for (let i = 0; i < mensaje.length; i++) {
                const pos = mensaje[i];
                if(pos !== uid){
                this.io.to(pos).emit('lista-usuarios',await usuariosactivos(pos));
                if(pos !==payload.de && pos !== payload.para){
                    this.io.to(pos).emit('resetchat');
                }
                }
            }
            this.io.to(uid).emit('lista-usuarios',await usuariosactivos(uid));
            this.io.to(payload.para).emit('recibidoproductosolicitud', payload.de);
            })
             //deseleccionar chat y activar las demas solicitudes
             socket.on('deseleccionarchat', async ({productorden,de,para})=>{
                await chatcanceladasolicitud(productorden);
                this.io.to(de).emit('resetchat');
                this.io.to(para).emit('resetchat');
                this.io.to(de).emit('lista-usuarios',await usuariosactivos(de));
                this.io.to(para).emit('lista-usuarios',await usuariosactivos(para));


             })
            //subir producto que se ordenara
            socket.on('orden', async ({solicitud, url})=>{
                solicitud.urlfoto = url.secure_url;
                solicitud.idfoto = (url.public_id===0)?nanoid():url.public_id;
                const producto = await subirproducto(solicitud);
                console.log(producto)
                this.io.to(producto.de + '').emit('orden',producto);
                this.io.emit('ordenagregarsolicitud',producto);

             })
              //subir producto con foto 
              socket.on('producto', async ({url,uid,producto})=>{
                const urlconver = {
                    secure_url: url.secure_url,
                    public_id: url.public_id
                }
                  try{
                      const productoadi = await subirproductoTodo(urlconver,uid,producto);
                      this.io.to(uid).emit('producto',productoadi);
                  }catch (e){
                      console.log(e);
                  }
             })
             //subir foto adicional de producto
             socket.on('subirfotoadicionalproducto', async ({url,pid})=>{
                const urlconver = {
                    secure_url: url.secure_url,
                    public_id: url.public_id
                }
                  try{
                      await adicionarfotoproducto(urlconver,pid);
                      this.io.to(uid).emit('subirfotoadicionalproducto',urlconver);
                  }catch (e){
                      console.log(e);
                  }
             })
             //subir Parrafo adicional de producto
             socket.on('subirparrafonuevo', async ({Parrafo,pid})=>{
                  try{
                      await adicionarParrafoproducto(Parrafo,pid);
                      this.io.to(uid).emit('subirparrafonuevo',Parrafo);
                  }catch (e){
                      console.log(e);
                  }
             })
             //eliminar producto carrito 
             socket.on('eliminarproductocarrito', async ({pid})=>{
                try{
                    const res = await eliminarproductocarrito(pid,uid);
                    this.io.to(uid).emit('lista-carrito',await cargarproductoscarrito(uid));     
                    this.io.to(uid).emit('eliminarproductocarrito',res);
                }catch (e){
                    console.log(e);
                }
           })
             //eliminar Parrafo de producto
             socket.on('productoparrafoeliminar', async ({pid,index})=>{
                try{
                    await eliminarparrafoproducto(pid,index);
                    this.io.to(uid).emit('productoparrafoeliminar',index);
                }catch (e){
                    console.log(e);
                }
           })
            //adicionar producto comprado
           socket.on('anadircompra', async ({codigo,preference, id,status})=>{
              try{
                const userinformarventa =  await adicionarproductocomprado(uid,codigo,id,status,preference);
                console.log(userinformarventa)
                if(userinformarventa){
                    this.io.to(userinformarventa).emit('lista-vendidos',await cargarproductosvendidos(userinformarventa));   
                    this.io.to(userinformarventa).emit('notificacion-venta');       
                    this.io.to(uid).emit('lista-compras',await cargarproductoscomprados(uid));     
                }

              }catch (e){
                  console.log(e);
              }
         })
            //guardar carrito producto
            socket.on('guardarcarrito', async ({pid})=>{
                  try{
                    const res = await guardarcarritoproducto(uid,pid);
                    this.io.to(uid).emit('lista-carrito',await cargarproductoscarrito(uid));     
                    this.io.to(uid).emit('guardarcarrito',res);
                  }catch (e){
                      console.log(e);
                  }
             })
               //eliminar foto restar producto
               socket.on('fotoproductoeliminar', async ({url,pid})=>{
                const urlconver = {
                    secure_url: url.secure_url,
                    public_id: url.public_id
                }
                  try{
                      await eliminarfotoproductoadicional(urlconver,pid);
                      this.io.to(uid).emit('fotoproductoeliminar',urlconver);
                  }catch (e){
                      console.log(e);
                  }
             })
             //modificar producto foto
             socket.on('productomodificar', async ({Producto,url})=>{
                try {     
                   await modificardatosproducto(Producto,url);
                   this.io.to(Producto.de).emit('productomodificar',Producto);
                } catch (error) {
                    console.log(error);
                }
             })
               //eliminar producto foto
               socket.on('productoeliminar', async ({uidfoto,Producto})=>{
                try {     
                    await cloudinary.cloudinary.uploader.destroy(uidfoto[0].public_id, {type : 'upload', resource_type : 'image'}, (res)=>{
                        return res;
                   });
                   await eliminarproductouser(Producto.pid);
                   this.io.to(Producto.de).emit('productoeliminar',Producto.pid);
                } catch (error) {
                    console.log(error);
                }
             })
            //actualizar foto de perfil
             socket.on('fotouser', async ({url,uid})=>{
                await actualizarfotoperfil(url,uid);
                this.io.to(uid).emit('fotouser',url.secure_url);
                this.io.emit('lista-usuarios',await usuariosactivos());
             })
             //agregar foto adicional usuario
             socket.on('fotouseradicional', async ({url,uid})=>{
                await agregarfotouser(url,uid);
                this.io.to(uid).emit('fotouseradicional',{urlfoto:url.secure_url, uidfoto:url.public_id});
             })
             //eliminar foto
             socket.on('fotousereliminar', async ({uidfoto,uid})=>{
                try {     
                    await cloudinary.cloudinary.uploader.destroy(uidfoto, {type : 'upload', resource_type : 'image'}, (res)=>{
                        return res;
                   });
                   await eliminarfotouser({uidfoto,uid});
                   this.io.to(uid).emit('fotousereliminar',uidfoto);
                } catch (error) {
                    console.log(error);
                }
             })
            //cuando un cliente elimina un producto 
             socket.on('eliminarorden', async ({oid,idfoto})=>{
                 try {     
                     const informarActivo = await eliminarproducto(oid,idfoto);
                     for (let i = 0; i < informarActivo.length; i++) {
                        const pos = informarActivo[i];
                        if(pos !== uid){
                        this.io.to(pos).emit('resetchat');
                        this.io.to(pos).emit('lista-usuarios',await usuariosactivos(pos));
                        }
                    }
                    this.io.to(uid).emit('lista-usuarios',await usuariosactivos(uid));
                     this.io.emit('eliminarorden',oid);
                 } catch (error) {
                     console.log(error);
                 }
             });
              //cuando un cliente selecciona un producto del chat
              socket.on('desactivarproducto', async ({oid,para})=>{
                try {     
                    await desactivarproducto(oid);
                    this.io.to(para).emit('desactivarproducto',true);
                } catch (error) {
                    console.log(error);
                }
            });
             //cuando el cliente se desconecta emite a todos que el cliente se desconecto
             socket.on('disconnect',async ()=>{
                 console.log('cliente desconectado')
                await userdesconectado(uid);
                 const res = await usuariosactivos(uid);
                 for (let i = 0; i < res.length; i++) {
                    const pos = res[i]._id + '';
                    if(pos !== uid){
                    this.io.to(pos).emit('lista-usuarios',await usuariosactivos(pos));
                    }
                }
                })
        }
        );
    }


}


module.exports = Sockets;