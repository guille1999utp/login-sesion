const {Schema,model} = require('mongoose');
const puroductoSchema = new Schema({
    de:  {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    titulo:  {
        type: String,
        required : true,
        trim: true,
    },
    detalles:  {
        type: Array,
        default:{
            Age:'',
            Categoria:'',
            Ubicaion:'',
            DomicilioIncluido:'',
            Garantia:'',
        }
    },
    fotosdescripsion:  {
        type: Array,
        default:[]
    },
    textdescripsion:  {
        type: Array,
        default:[]
    },
    creacion : {
        type: Date,
        default: Date.now
    }}
);

puroductoSchema.method('toJSON', function(){
    const { __V, _id, ...object} = this.toObject();
    object.pid = _id;
    return object;
})

module.exports = model('Producto', puroductoSchema);