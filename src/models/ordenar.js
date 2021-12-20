const {Schema,model} = require('mongoose');
const ordenarProducto = new Schema({
    categoria:  {
        type: String,
        required : true,
        trim: true,
    },
    nombre:  {
        type: String,
        required : true,
        trim: true,
    },
    descripsion:{
        type: String,
        required : true,
        unique: true,
        trim: true
    },
    diareq:{
        type: Date,
        required : true,
        default: false
    },
    password:{
       type: String,
       required : true,

    },
    urlfoto:{
        type: String,
        required : true,
 
     }},{
        timestamps : true
    }
);

userSchema.method('toJSON', function(){
    const { __V, _id, password, ...object} = this.toObject();
    object.oid = _id;
    return object;
})

module.exports = model('Ordenproducto', ordenarProducto);