const express = require("express")
const cors = require("cors")
const WebHookController = require("../server/controller/webHooks")
const educatorRouter = require("./routes/educatorRoute")
const courseRouter = require("./routes/courseRoute")
const userRouter = require("./routes/userRoute")
const { clerkMiddleware } = require("@clerk/express")
const app = express()

// app.use(cors())
const allowedOrigins = [
    'http://localhost:5173', // Local dev
    'https://lms-frontend-nine-amber.vercel.app' // Deployed frontend
]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))


app.use(clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
}));


// app.use((req, res, next) => {
//     console.log('Headers:', req.headers);
//     console.log('Auth object:', req.auth);
//     next();
// })


app.post("/stripe", express.raw({ type: 'application/json' }), (req, res, next) => {
    console.log("✅ Stripe route was hit");
    next();
}, WebHookController.stripeWebhooks)

app.use(express.json())
app.post('/clerk', WebHookController.clerkWebHooks)
app.use("/api/educator", educatorRouter)
app.use("/api/course", courseRouter)
app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    res.status(200).json({
        status: "successss"
    })
})


module.exports = app