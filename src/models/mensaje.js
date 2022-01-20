const {Schema,model} = require('mongoose');
const Mensaje = new Schema({
    de:  {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    
    para:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    mensaje:{
        type: String,
        required : true,
    },
    productorden:  {
        type: Schema.Types.ObjectId,
        ref: 'Ordenproducto',
        required : true,

    }
},{
    timestamps : true
});

Mensaje.method('toJSON', function(){
    const { __V, ...object} = this.toObject();
    return object;
})

module.exports = model('Mensaje', Mensaje);