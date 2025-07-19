const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
  theater_name: { type: String, required: true },
  address: { type: String, required: true },
  location: { type: String, required: true },
  theater_images: [{ type: String }],
  ownerId: { type: String },
  total_bookings: { type: Number },
  total_Revenue: { type: Number },
  total_user: { type: Number },
  movies: [
    {
      movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie',
        required: true,
      },
      movie_name: {
        type: String,
        required: true,
      },
      show_price: { type: Number },
      occupiedSeat: { type: Object, default: {} },
      schedules: [
        {
          date: { type: String, required: true }, // e.g., "2025-07-25"
          time: { type: String, required: true }, // e.g., "9:00 PM"
        }
      ]
    }
  ]
});

const THEATER = mongoose.model("theater", theaterSchema);
module.exports = THEATER;
