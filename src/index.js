const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database');
const app = express();
const morgan = require('morgan');

app.set('port', process.env.PORT);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(require('./rutas/index'))

app.listen(app.get('port'),()=>{
    console.log('escuchando en el puerto ', app.get('port'));
});