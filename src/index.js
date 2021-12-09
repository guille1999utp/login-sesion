const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path')
const socketio = require('socket.io')
require('dotenv').config();
require('./database');
const app = express();
const morgan = require('morgan');
const server = http.createServer(app);
const io = socketio(server , { });
app.set('port', process.env.PORT);

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(cors());
app.use(express.json());
app.use(require('./rutas/index'))

server.listen(app.get('port'),()=>{
    console.log('escuchando en el puerto ', app.get('port'));
});