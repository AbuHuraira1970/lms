const express = require("express")
const cors = require("cors")
const WebHookController = require("../server/controller/webHooks")
const educatorRouter = require("./routes/educatorRoute")
const courseRouter = require("./routes/courseRoute")
const { clerkMiddleware } = require("@clerk/express")
const app = express()

// app.use(cors())
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
}));


app.use(express.json())

app.use(clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
}));

app.use((req, res, next) => {
    console.log('Headers:', req.headers);
    console.log('Auth object:', req.auth);
    next();
});

app.post('/clerk', WebHookController.clerkWebHooks)
app.use("/api/educator", educatorRouter)
app.use("/api/course", courseRouter)

app.get("/", (req, res) => {
    res.status(200).json({
        status: "successss"
    })
})


module.exports = app