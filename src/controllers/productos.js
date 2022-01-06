const Producto = require('../models/producto');

const pedirproducto = async (req,res) => {
    const producto = req.params.producto;
    
try {
    const descr = await Producto.findById( producto );
    res.json({
        ok:true,
        de:descr.de,
        pid:descr._id,
        textdescripsion:descr.textdescripsion,
        fotosdescripsion: descr.fotosdescripsion,
        titulo:descr.titulo,
        detalles: descr.detalles
        })
} catch (error) {
    console.log(error);
    res.json({
        ok:false,
        msg:'no se encontro producto'
    })
}
    }
    
    const informacionAdicional = async (req,res) => {
        const producto = req.params.busqueda;
      const {nuevo,usado,modelo,ubicacion,min,max,categoria,enviogratis,mayor,menor} = req.query;
        try {
            const descr = await Producto.find({$or: [{ titulo: { $regex: producto } },{ textdescripsion: { $regex: producto} }] });
            res.json({
                ok:true,
                descr
                })
        } catch (error) {
            console.log(error);
            res.json({
                ok:false,
                msg:'no se encontro producto'
            })
        }

        }
    

module.exports ={
    pedirproducto,
    informacionAdicional
}