const jwt = require('jsonwebtoken');

 const validarjwt = (req, res, next) =>{
    try {
        const token = req.header('x-token');
    if (!token) {
     return res.status(401).json({
         ok : false,
        msg: 'no hay token disponible'
     })
 } 
 const { uid } = jwt.verify(token, process.env.JWT_clave)
  req.uid = uid;
  next();

    } catch (error) {
       res.status(401).json({
           ok: false,
           msg: 'token no permitido'
       })
    }
}
module.exports = { validarjwt }