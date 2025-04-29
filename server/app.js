const express = require("express")
const cors = require("cors")
const WebHookController = require("../server/controller/webHooks")
const educatorRouter = require("./routes/educatorRoute")
const { clerkMiddleware,requireAuth } = require("@clerk/express")
const app = express()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.post('/clerk',WebHookController.clerkWebHooks)
app.use("/api/educator",educatorRouter)

app.get("/",(req,res)=>{
    res.status(200).json({
        status: "successss"
    })
})



module.exports = app