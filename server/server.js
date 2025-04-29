const dotenv = require("dotenv")
dotenv.config({path: "./config.env"})

const mongoose = require("mongoose")
const app = require("./app")

const main = async()=>{
    await mongoose.connect(process.env.DB)
    console.log("DB Connected")
}

main().catch(err=>{
    console.log(err)
})


const port = process.env.PORT
app.listen(port,()=>{
    console.log("Server started")
})