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
      const {nuevo = false ,usado = false ,modelo = '',ubicacion = '',Garantia = 0,min = 0,max = 0,categoria = '',enviogratis = 0,mayor = 'false',menor = 'false'} = req.query;
        try {
            let filtervar = await Producto.find({$or: [{ titulo: { $regex: producto } },{ textdescripsion: { $regex: producto} }] });
            const n1 = parseInt(min);
            const n2 = parseInt(max);
            if(nuevo === 'true'){
            filtervar = filtervar.filter(function(producto){
                return 'true' === producto.detalles[0].nuevo;
              })
            }else{
              console.log('no entro a nuevo');
            }
            if(usado === 'true'){
                filtervar = filtervar.filter(function(producto){
                    return 'false' === producto.detalles[0].nuevo;
                  })
                }else{
                  console.log('no entro a usado');
                }
            if(modelo.length !== 0){
                  filtervar = filtervar.filter(function(producto){
                    return modelo === producto.detalles[0].Age;
                 })
                    }else{
                      console.log('no entro a modelo');
                    }
             if(ubicacion.length !== 0){
                  filtervar = filtervar.filter(function(producto){
                     return ubicacion === producto.detalles[0].Ubicaion;
                  })
                     } else{
                      console.log('no entro a ubiacion');
                    }
              if(Garantia !== 0 ){
                   filtervar = filtervar.filter(function(producto){
                     return Garantia === producto.detalles[0].Garantia;
                   })
                     }   else{
                      console.log('no entro a garantia');
                    }  
             if(n1 !== 0 ){
                 filtervar = filtervar.filter(function(producto){
                  const number = parseInt(producto.detalles[0].Precio)
                  if(number > n1){
                    return producto;
                  }else{
                    console.log('verga')
                  }
                 })

                  } else{
                    console.log('no entro a n1');
                  }
                 
             if(n2 !== 0 ){

                 filtervar = filtervar.filter(function(producto){
                   const number = parseInt(producto.detalles[0].Precio)
                   if(number <= n2){
                     return producto;
                   }else{
                     console.log('verga')
                   }
                 })
               }   else{
                console.log('no entro a n2');
              }
             if(categoria.length !== 0 ){
                 filtervar = filtervar.filter(function(producto){
                   return producto.detalles[0].Categoria === categoria;
                })
              }   else{
                console.log('no entro a categoria');
              }

              if(enviogratis !== 0 ){
                 filtervar = filtervar.filter(function(producto){
                   return producto.detalles[0].DomicilioIncluido === enviogratis;
               })
             } else{
              console.log('no entro a envio');
            }  
             if(mayor === 'true' ){
              filtervar.sort(function (a, b) {
                if (parseInt(a.detalles[0].Precio) > parseInt(b.detalles[0].Precio)) {
                  return -1;
                }
                if (parseInt(a.detalles[0].Precio) < parseInt(b.detalles[0].Precio)) {
                  return 1;
                }
                return 0;
              });
            }   else{
              console.log('no entro a mayor');
            }
            if(menor === 'true' ){
              filtervar.sort(function (a, b) {
                if (parseInt(a.detalles[0].Precio) > parseInt(b.detalles[0].Precio)) {
                  return 1;
                }
                if (parseInt(a.detalles[0].Precio) < parseInt(b.detalles[0].Precio)) {
                  return -1;
                }
                return 0;
              });
            }   else{
              console.log('no entro a menor');
            }
            console.log(filtervar)

            res.json({
                ok:true,
                filtervar
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