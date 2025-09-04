const express = require("express");
const cron = require("node-cron");
const THEATER = require("./models/theaterModel.js");
const cors = require('cors');
const dotenv = require('dotenv');
const { clerkMiddleware } = require('@clerk/express');


const connectDB = require('./configs/db.js');
const staticRoutes = require('./router/staticRoute.js');
const postRoutes = require('./router/postRoutes.js');
const { cleanExpiredSchedules } = require("./configs/autoCleanUp.js");


dotenv.config();
const app = express();
const PORT = 5000;

// Connect to MongoDB
const startServer = async () => {
  await connectDB(); // ✅ Wait for DB
  app.listen(PORT,'0.0.0.0', () => console.log(`🚀 Server started at port ${PORT}`));
};

// Other middlewares AFTER webhook route
app.use(cors());
app.use(express.json()); // JSON parser (do NOT use before the Stripe webhook)
app.use(clerkMiddleware());

// Routes
app.use('/', staticRoutes);
app.use('/', postRoutes);

// Root route
app.get("/", (req, res) => res.send('Server is started'));

// Start server
startServer(); // ✅ Start only after DB is ready

//Auto CleanUp
cleanExpiredSchedules()

// Run at 12:00 AM every day
cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    console.log("⏰ Running daily cleanup at midnight...");

    // 1 Remove expired schedules
    const scheduleCleanup = await THEATER.updateMany(
      {},
      {
        $pull: {
          "movies.$[].schedules": {
            date: { $lt: today },
          },
        },
      }
    );

    console.log("✅ Removed expired schedules from", scheduleCleanup.modifiedCount, "theaters");

    // 2 Remove movies with empty schedules
    const emptyMoviesCleanup = await THEATER.updateMany(
      {},
      {
        $pull: {
          movies: {
            schedules: { $size: 0 },
          },
        },
      }
    );

    console.log("✅ Removed empty movies from", emptyMoviesCleanup.modifiedCount, "theaters");

  } catch (error) {
    console.error("❌ Error in daily cleanup:", error);
  }
});

