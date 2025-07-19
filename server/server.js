const express = require("express")
const cors = require('cors')
const dotenv = require('dotenv')
const { clerkMiddleware } = require('@clerk/express')
const { serve } = require("inngest/express");

const { inngest, functions } = require('./inngest/index.js')
const connectDB = require('./configs/db.js');
const staticRoutes = require('./router/staticRoute.js')
const postRoutes = require('./router/postRoutes.js')
const protectAdmin = require('./auth/auth.js')

const app = express()
const PORT = 5000;

// MongoDB connection
connectDB()

// Middleware
app.use(express.json())
app.use(cors())
dotenv.config()
app.use(clerkMiddleware())
app.use('/',staticRoutes)
app.use('/',postRoutes)


// API Routes
app.get("/", (req, res) => res.send('Server is Started'))
app.use("/api/inngest", serve({ client: inngest, functions }))

app.listen(PORT, () => console.log("Server started at port 5000"));
