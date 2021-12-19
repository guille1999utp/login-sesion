const { userconectado, userdesconectado, usuariosactivos,savemessage } = require("./helpers/eventoSockets");
const { comprobacionJWT } = require("./helpers/jwt");


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

            this.io.emit('lista-usuarios',await usuariosactivos());

            socket.on('mensaje', async (payload)=>{
               const mensaje = await savemessage(payload);
               this.io.to(payload.para).emit('mensaje',mensaje);
               this.io.to(payload.de).emit('mensaje',mensaje);
            })
            
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