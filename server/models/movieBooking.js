const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    user: { type: String, required: true, ref: "user" },
    show: { type:mongoose.Schema.Types.ObjectId,ref:'movie', required: true},
    theater: { type: String, required: true},
    amount: { type: Number, required: true },
    bookedSeats: { type: Array, required: true },
    isPaid: { type: Boolean, default: false },
    paymentLink: { type: String },
    showDateTime:{type:String,required:true},
    sessionId:{type:String}
  },
  { timestamps: true }
);

const BOOKING = model("booking", bookingSchema);

module.exports = BOOKING;
