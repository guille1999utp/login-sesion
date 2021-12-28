const Usuario = require('../models/usuario');

const perfilUsuario = async (req,res) => {
const perfil = req.params.de;

try {
    const user = await Usuario.findById( perfil );
    res.json({
        ok:true,
        infoadicional:user.infoadicional
    })
} catch (error) {
    console.log(error);
    res.json({
        ok:false,
        msg:'no se encontro perfil'
    })
}
}
const modificacionPerfil = async (req,res) => {
    const miId = req.uid;
    try {
        const user = await Usuario.findByIdAndUpdate( miId, {
            infoadicional: req.body
        } );
        res.json({
            ok:true,
            infoadicional:user.infoadicional
        })
    } catch (error) {
        console.log(error);
    }
    }

module.exports ={
    modificacionPerfil,
    perfilUsuario
}