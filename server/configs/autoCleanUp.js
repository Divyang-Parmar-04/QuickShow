const BOOKING = require('../models/movieBooking');
const THEATER = require('../models/theaterModel');

const cleanExpiredSchedules = async () => {

    const now = new Date();
    const today = new Date().toISOString().split("T")[0];
    console.log("🧹 Running cleanup for expired movie schedules...");

    try {
        // 1. Remove expired schedules from movies
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

        // 2. Remove movie objects with no schedules
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
            console.log("Expired Bookings Deleted", bookingCleanup.deletedCount, "expired bookings");
        }

        console.log("Schedules removed from:", scheduleCleanup.modifiedCount, "documents");
        console.log("Empty movies removed from:", emptyMoviesCleanup.modifiedCount, "documents");


    } catch (error) {
        console.error(" Cleanup failed:", error);
    }
};

module.exports = { cleanExpiredSchedules };
