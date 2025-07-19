const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    user: { type: String, required: true, ref: "user" },
    show: { type: String, required: true},
    theater: { type: String, required: true},
    amount: { type: Number, required: true },
    bookedSeats: { type: Array, required: true },
    isPaid: { type: Boolean, default: false },
    paymentLink: { type: String },
  },
  { timestamps: true }
);

const BOOKING = model("booking", bookingSchema);

module.exports = BOOKING;
