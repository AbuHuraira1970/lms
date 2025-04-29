const express = require("express")
const cors = require("cors")
const WebHookController = require("../server/controller/webHooks")
const app = express()

app.use(cors())
app.use(express.json())

app.post('/clerk',WebHookController.clerkWebHooks)

app.get("/",(req,res)=>{
    res.status(200).json({
        status: "success"
    })
})



module.exports = app