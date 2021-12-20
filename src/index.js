const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const Sockets  = require('./sockets');
const socketio = require('socket.io')
require('dotenv').config();
require('./database');
const app = express();
const server = http.createServer(app);
const io = socketio(server , { });
app.set('port', process.env.PORT);
new Sockets(io);
app.use(express.static(path.resolve(__dirname, '../public')));
app.use(cors());
app.use(express.json());
//rutas
app.use(require('./rutas/index'))
app.use(require('./rutas/mensajes'))
app.use(require('./rutas/ordenar'))

server.listen(app.get('port'),()=>{
    console.log('escuchando en el puerto ', app.get('port'));
});