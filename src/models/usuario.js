const {Schema,model} = require('mongoose');
const userSchema = new Schema({
    nombre:  {
        type: String,
        required : true,
        trim: true,
    },
    infoadicional:  {
        type: Map,
        of:String,
        default:{
            Cordenadas:'',
            Direccion:'',
            Barrio:'',
            Nit:'',
            Privado:'',
            celular:'',
            telefono:'',
            Servicio:'',
            tencion:'',
            Venta:'',
            Funcionamiento:'',
            Gerente:'',
            cedulaGerente:'',
            Representantelegal:'',
        }
    },
    fotosdescripsion:  {
        type: Array,
        default:[]
    },
    dinerosolicitudes:  {
        type: Number,
        default:0
    },
    productosComprados:  {
        type: Array,
        default:[]
    },
    productosVendidos:  {
        type: Array,
        default:[]
    },
    carrito:  {
        type: Array,
        default:[]
    },
    Categoria:  {
        type: String,
        trim: true,
        default: 'Repuestos'
    },
    urlfoto:  {
        type: String,
        trim: true,
        default: 'https://res.cloudinary.com/dmgfep69f/image/upload/v1640536316/orgeial7kefv2dzsdqqt.webp'
    },
    uidfoto:  {
        type: String,
        trim: true,
        unique: true
    },
    correo:{
        type: String,
        required : true,
        unique: true,
        trim: true
    },
    online:{
        type: Boolean,
        required : true,
        default: false
    },
    verificado:{
        type: Boolean,
        required : true,
        default: false
    },
    fechnacimiento:{
        type: Date,
        required : true,
    },
    password:{
       type: String,
       required : true,

    },
    creacion : {
        type: Date,
        default: Date.now
    }}
);

userSchema.method('toJSON', function(){
    const { __V, _id, password, ...object} = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Usuario', userSchema);