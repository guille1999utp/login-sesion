const mongoose = require('mongoose'); 
mongoose.connect(process.env.MONGODB_CNN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('DB esta conectada');
});