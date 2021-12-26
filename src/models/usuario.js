const {Schema,model} = require('mongoose');
const userSchema = new Schema({
    nombre:  {
        type: String,
        required : true,
        trim: true,
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