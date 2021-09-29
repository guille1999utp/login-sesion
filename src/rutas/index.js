const { Router } = require('express');
const router = Router();
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

router.get('/users',async(req, res)=>{
    const usuarios = await Usuario.find();
    res.json(usuarios);
});


router.put('/user/:id',async(req, res)=>{
  const user = req.params.id;
  const { nombre , password , fechnacimiento} = req.body;
  await Usuario.findByIdAndUpdate(user, {
      nombre,
      password,
      fechnacimiento
  })
  res.json({
    message : 'actualizado'
});
});


router.get('/user/:id',async(req, res)=>{
    const usuario = await Usuario.findById(req.params.id);
    res.json(usuario);
});

router.post('/signup',async (req, res)=>{
    const { nombre, correo, password ,fechnacimiento } = req.body;
    const newuser = new Usuario({
        nombre,
        correo,
        password,
        fechnacimiento
    });
    const salt = await bcryptjs.genSalt(10);
    newuser.password = await bcryptjs.hash(password , salt);
    await newuser.save();
    res.json({
        message : 'guardado'
    });
});


router.delete('/user/:id',async (req, res)=>{
   await Usuario.findByIdAndDelete(req.params.id);
   res.json({
    message : 'usuario eliminado'
});
});


module.exports = router;


