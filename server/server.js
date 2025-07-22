const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const { clerkMiddleware } = require('@clerk/express');
const { serve } = require("inngest/express");

const { inngest, functions } = require('./inngest/index.js');
const connectDB = require('./configs/db.js');
const staticRoutes = require('./router/staticRoute.js');
const postRoutes = require('./router/postRoutes.js');
const protectAdmin = require('./auth/auth.js');
const { stripeWebHooks } = require("./controller/stripewebhooks.js");

dotenv.config();
const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// STRIPE Webhook FIRST before express.json()
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebHooks);

// All other middlewares AFTER webhook route
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Other Routes
app.use('/', staticRoutes);
app.use('/', postRoutes);

// Inngest functions
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => res.send('Server is Started'));

//  Start server
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
