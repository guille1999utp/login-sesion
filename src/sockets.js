const { comprobacionJWT } = require("./helpers/jwt");


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', ( socket ) => {
           const [ valido, uid ] = comprobacionJWT(socket.handshake.query['x-token']);
           if(!valido){
               console.log('socket erroneo');
               return socket.disconnect();
           }
           console.log('cliente conectado ',uid);
            // TODO: Validar el JWT 
            // Si el token no es válido, desconectar

            // TODO: Saber que usuario está activo mediante el UID

            // TODO: Emitir todos los usuarios conectados

            // TODO: Socket join, uid

            // TODO: Escuchar cuando el cliente manda un mensaje
            // mensaje-personal

            // TODO: Disconnect
            // Marcar en la BD que el usuario se desconecto
            // TODO: Emitir todos los usuarios conectados
             socket.on('disconnect',()=>{
                 console.log('cliente desconectado')
             })
            
        
        }
        
        );
    }


}


module.exports = Sockets;