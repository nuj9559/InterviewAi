import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import path from "node:path"
import { fileURLToPath } from "node:url"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"

const app = express()
const allowedOrigins = [
    "https://interviewai-s13s.onrender.com",
    "https://interviewai-s13s.onrender.com",
    "https://interviewai-s13s.onrender.com",
    process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)

app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" })
})

app.use("/api", (_req, res) => {
    res.status(404).json({ message: "API route not found" })
})

const clientDistPath = fileURLToPath(new URL("../client/dist", import.meta.url))
app.use(express.static(clientDistPath))
app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"))
})

const PORT = process.env.PORT || 6000
app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
    connectDb()
})
