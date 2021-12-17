const jwt = require('jsonwebtoken');

const generarjwt = (uid) =>{
return new Promise((resolve, reject)=>{
    const payload = {uid};
    jwt.sign(payload, process.env.JWT_clave,{
        expiresIn : '48h'
    }, (err, token) =>{
        if(err){
            console.log(err);
            reject('no se genero el jwt');
        }else{
            resolve(token)
        }
    })

})
}

const comprobacionJWT = (token = '') =>{
    try {
        const {uid} = jwt.verify(token, process.env.JWT_clave);
        return [true, uid]
    } catch (error) {
        return [true, null]
    }
    }
module.exports = {
    generarjwt,
    comprobacionJWT
}