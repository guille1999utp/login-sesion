const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarjwt } = require('../helpers/jwt');

const Crearusuario = async (req, res = response)=>{

    try{
        const { correo, password } = req.body;
        const existecorreo = await Usuario.findOne({ correo });
        if(existecorreo){
        return res.status(400).json({
            ok:false,
            msg: 'el correo ya existe'
        })
        }
            const newuser = new Usuario(req.body);
        const salt = bcryptjs.genSaltSync();
        newuser.password = bcryptjs.hashSync(password , salt);
        await newuser.save();

        const token = await generarjwt( newuser.id)
        res.json({
            ok: true,
            newuser,
            token
        });
    }
    catch (error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'hubo fallas en la base de datos'
        })
            }
}

const InicioSesion = async (req, res = response)=>{
    const {correo, password } = req.body;
    try{
   const usuarioBd = await Usuario.findOne({correo});
   if(!usuarioBd){
       return res.status(404).json({
           ok: false,
           msg: 'email no existe'
       });
   }
   const validarcontraseña = bcryptjs.compareSync(password, usuarioBd.password)
   if(!validarcontraseña){
    return res.status(404).json({
        ok: false,
        msg: 'contraseña incorrecta'
    });
}
const token = await generarjwt( usuarioBd.id);
return res.json({
    ok: true,
    usuarioBd,
    token
});

    } catch (error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'hubo fallas en la base de datos'
        })
            }
    
}


const renovar = async (req, res = response)=>{
    const uid = req.uid;
    const token = await generarjwt(uid);
    const usuario = await  Usuario.findById(uid);
    return res.json({
    ok: true,
    usuario,
    token
});
}
module.exports = { 
    Crearusuario,
    InicioSesion,
    renovar
}