const {Schema,model} = require('mongoose');
const userSchema = new Schema({
    nombre:  {
        type: String,
        required : true,
        trim: true,
    },
    correo:{
        type: String,
        required : true,
        unique: true,
        trim: true
    },
    fechnacimiento:{
        type: Date,
        required : true,
    },
    password:{
       type: String
    },
    creacion : {
        type: Date,
        default: Date.now
    }, 
    fechcreacion:{
        type: Date,
        required : true,
        default : Date.now
}}
);

module.exports = model('Usuario', userSchema);