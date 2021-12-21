const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLAUD_NAME,
    api_key: process.env.API_KEY_CLAUDINARY,
    api_secret: process.env.API_SECRET_CLAUDINARY
})
module.exports = {
    cloudinary
} 