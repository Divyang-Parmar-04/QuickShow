const express = require("express");
const cron = require("node-cron");
const THEATER = require("./models/theaterModel.js");
const cors = require("cors");
const dotenv = require("dotenv");
const BOOKING = require('./models/movieBooking.js')

const connectDB = require("./configs/db.js");
const staticRoutes = require("./router/staticRoute.js");
const postRoutes = require("./router/postRoutes.js");
const { cleanExpiredSchedules } = require("./configs/autoCleanUp.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/", staticRoutes);
app.use("/", postRoutes);

// Root
app.get("/", (req, res) => res.send("Server is started"));

// Connect to DB before exporting app
connectDB()
  .then(() => {
    console.log("MongoDB connected");
    cleanExpiredSchedules();
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });

//  Development: run normally
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`Server started at http://localhost:${PORT}`)
  );
}
// Export the app (Vercel will handle it)
module.exports = app;

// Run at 12:00 AM every day
cron.schedule("0 0 * * *", async () => {
  try {

    const now = new Date();
    const today = new Date().toISOString().split("T")[0];

    // console.log(" Running daily cleanup at midnight...");

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

    // console.log("✅ Removed expired schedules from", scheduleCleanup.modifiedCount, "theaters");

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

    // console.log("✅ Removed empty movies from", emptyMoviesCleanup.modifiedCount, "theaters");

    // 3️⃣ REMOVE EXPIRED BOOKINGS

    const bookings = await BOOKING.find({}, { showDateTime: 1 });

    const expiredBookingIds = bookings
      .filter((booking) => {
        const showDate = new Date(booking.showDateTime);
        return showDate < now;
      })
      .map((booking) => booking._id);

    if (expiredBookingIds.length > 0) {
      const bookingCleanup = await BOOKING.deleteMany({
        _id: { $in: expiredBookingIds },
      });

      console.log("🗑️ Deleted", bookingCleanup.deletedCount,"expired bookings");

    } else {
      console.log("ℹ️ No expired bookings found");
    }

  } catch (error) {
    console.error("❌ Error in daily cleanup:", error);
  }
});

