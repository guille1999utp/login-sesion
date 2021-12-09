const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarjwt } = require('../helpers/jwt');

const Crearusuario = async (req, res = response)=>{

    try{
        const { correo } = req.body;
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

        const token = generarjwt( newuser.id)
        res.json({
            ok: true,
            newuser,
            token
        });
    }
    catch{

    }
}

const InicioSesion = async (req, res = response)=>{
    

    const { nombre, correo, password ,fechnacimiento } = req.body;
    
}
module.exports = { 
    Crearusuario,
    InicioSesion
}