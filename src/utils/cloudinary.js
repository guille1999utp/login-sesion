const cloudinary = require('cloudinary').v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLAUD_NAME,
    api_key: process.env.API_KEY_CLAUDINARY,
    api_secret: process.env.API_SECRET_CLAUDINARY
})
module.exports = {
    cloudinary
} 