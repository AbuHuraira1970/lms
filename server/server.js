const dotenv = require("dotenv")
dotenv.config({path: "./config.env"})

const mongoose = require("mongoose")
const cloudinary = require('cloudinary').v2;
const app = require("./app")

const main = async()=>{
    await mongoose.connect(process.env.DB)
    console.log("DB Connected")
}

main().catch(err=>{
    console.log(err)
})

const connectCloudinary = async ()=>{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    })
}

connectCloudinary()

const port = process.env.PORT
app.listen(port,()=>{
    console.log("Server started")
})