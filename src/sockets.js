const { userconectado, modificardatosproducto, userdesconectado, usuariosactivos,savemessage,subirproducto, eliminarproducto,eliminarproductouser, subirproductoTodo,actualizarfotoperfil,agregarfotouser,eliminarfotouser } = require("./helpers/eventoSockets");
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
          
           await userconectado(uid);

           console.log('cliente conectado')
            
            socket.join( uid );
           
            this.io.emit('lista-usuarios',await usuariosactivos(uid));
            
            //mandar mensajes a los dos chats que se estan conectando
            socket.on('mensaje', async (payload)=>{
               const mensaje = await savemessage(payload);
               this.io.to(payload.para).emit('mensaje',mensaje);
               this.io.to(payload.de).emit('mensaje',mensaje);
            })
            //subir producto que se ordenara
            socket.on('orden', async ({solicitud, url})=>{
                solicitud.urlfoto = url.secure_url;
                solicitud.idfoto = (url.public_id===0)?nanoid():url.public_id;
                const producto = await subirproducto(solicitud);
                this.io.emit('orden',producto);
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
                     await cloudinary.cloudinary.uploader.destroy(idfoto, {type : 'upload', resource_type : 'image'}, (res)=>{
                         return res;
                    });
                     await eliminarproducto(oid);
                     this.io.emit('eliminarorden',oid);
                 } catch (error) {
                     console.log(error);
                 }
             })
             //cuando el cliente se desconecta emite a todos que el cliente se desconecto
             socket.on('disconnect',async ()=>{
                 console.log('cliente desconectado')
                await userdesconectado(uid);
                 this.io.emit('lista-usuarios',await usuariosactivos());
                })
            
        
        }
        
        );
    }


}


module.exports = Sockets;