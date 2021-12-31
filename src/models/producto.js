const {Schema,model} = require('mongoose');
const puroductoSchema = new Schema({
    titulo:  {
        type: String,
        required : true,
        trim: true,
    },
    detalles:  {
        type: Map,
        of:String,
        default:{
            Año:'',
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