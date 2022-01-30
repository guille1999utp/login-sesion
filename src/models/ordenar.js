const {Schema,model} = require('mongoose');

const ordenarProducto = new Schema({
    de:  {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nombre:  {
        type: String,
        required : true,
        trim: true,
    },
    aparecer:  {
        type: Boolean,
        default: true
    },
    descripsion:{
        type: String,
        required : true,
        trim: true
    },
    urlfoto:{
        type: String,
        required : true,
     },
     idfoto:{
        type: String,
        required : true,
        unique: true
     },
     categoria:  {
        type: String,
        required : true,
        trim: true,
    },
    },{
        timestamps : true
    }
);

ordenarProducto.method('toJSON', function(){
    const { __V, _id, password, ...object} = this.toObject();
    object.oid = _id;
    return object;
})

module.exports = model('Ordenproducto', ordenarProducto);