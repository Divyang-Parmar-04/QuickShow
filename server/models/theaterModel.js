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
        type:String,
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
          date: { type: String, required: true }, 
          time: { type: String, required: true },
          languages:{type:String},
          show_price:{type:Number},
          format:{type:String}

        }
      ]
    }
  ]
});

const THEATER = mongoose.model("theater", theaterSchema);
module.exports = THEATER;
