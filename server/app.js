const express = require("express")
const cors = require("cors")
const WebHookController = require("../server/controller/webHooks")
const app = express()

app.use(cors())

app.post('/clerk',express.raw({ type: 'application/json' }),WebHookController.clerkWebHooks)
app.use(express.json())

app.get("/",(req,res)=>{
    res.status(200).json({
        status: "success"
    })
})



module.exports = app