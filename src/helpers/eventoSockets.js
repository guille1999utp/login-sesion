const Usuario = require('../models/usuario');
const userconectado = async(uid) =>{
    const usuario = await Usuario.findById(uid);
    usuario.online = true;
    await usuario.save();
    return usuario;
}
const userdesconectado = async(uid) =>{
    const usuario = await Usuario.findById(uid);
    usuario.online = false;
    await usuario.save();
    return usuario;
}
const usuariosactivos = async() =>{
    const usuarios = await Usuario.find().sort('-online')
    return usuarios;
}
module.exports = {
    userconectado,
    userdesconectado,
    usuariosactivos
}