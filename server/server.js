const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const { clerkMiddleware } = require('@clerk/express');
const { serve } = require("inngest/express");

const { inngest, functions } = require('./inngest/index.js');
const connectDB = require('./configs/db.js');
const staticRoutes = require('./router/staticRoute.js');
const postRoutes = require('./router/postRoutes.js');
const { stripeWebHooks } = require("./controller/stripewebhooks.js");

dotenv.config();
const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Stripe webhook must come BEFORE body parsers like express.json()
app.post('/api/stripe',express.raw({ type: 'application/json' }), stripeWebHooks); // Stripe requires raw body


// Other middlewares AFTER webhook route
app.use(cors());
app.use(express.json()); // JSON parser (do NOT use before the Stripe webhook)
app.use(clerkMiddleware());

// Routes
app.use('/', staticRoutes);
app.use('/', postRoutes);

// Inngest functions
app.use("/api/inngest", serve({ client: inngest, functions }));

// Root route
app.get("/", (req, res) => res.send('Server is started'));

// Start server
app.listen(PORT, () => console.log(`🚀 Server started at port ${PORT}`));
