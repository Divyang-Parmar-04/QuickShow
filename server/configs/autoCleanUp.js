const THEATER = require('../models/theaterModel');

const cleanExpiredSchedules = async () => {
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

        console.log("Schedules removed from:", scheduleCleanup.modifiedCount, "documents");
        console.log("Empty movies removed from:", emptyMoviesCleanup.modifiedCount, "documents");
    } catch (error) {
        console.error(" Cleanup failed:", error);
    }
};

module.exports = { cleanExpiredSchedules };
