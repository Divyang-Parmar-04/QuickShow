
const BOOKING = require('../models/movieBooking')
const THEATER = require('../models/theaterModel')
const Stripe = require('stripe')
const dotenv = require('dotenv')
dotenv.config()


const createBooking = async (req, res) => {
  try {
    const { email, theaterId, showId, selectedSeats, showDateTime } = req.body;

    // 1. Get theater
    const theater = await THEATER.findById(theaterId);
    if (!theater) return res.json({ msg: "Theater not found" });

    // 2. Get show data
    const show = theater.movies.find((mov) => mov.movieId.toString() === showId);
    if (!show) return res.json({ msg: "Show not found in theater" });

    // 3. Check if selectedSeats are already occupied for this showDateTime
    const showKey = showDateTime;
    if (!show.occupiedSeat) show.occupiedSeat = {};
    const occupiedSeatsForShow = show.occupiedSeat[showKey] || [];

    // Check if any selected seat is already occupied
    const seatAlreadyBooked = selectedSeats.some(seat => occupiedSeatsForShow.includes(seat));
    if (seatAlreadyBooked) {
      return res.json({ book: "occupied", msg: "One or more selected seats are already booked" });
    }

    // 4. Calculate booking amount
    const bookingAmount = show.show_price * selectedSeats.length;

    // 5. Create booking
    const booking = await BOOKING.create({
      user: email,
      show: showId,
      theater: theaterId,
      amount: bookingAmount,
      bookedSeats: selectedSeats,
      showDateTime: showDateTime
    });

    // console.log(booking._id.toString())

    if (!booking) return res.json({ msg: "Booking failed" });

    // 6. Update theater stats
    theater.total_bookings = (theater.total_bookings || 0) + 1;
    theater.total_Revenue = (theater.total_Revenue || 0) + bookingAmount;

    // 7. Update occupiedSeat for this show and showDateTime
    const updatedOccupiedSeats = [...occupiedSeatsForShow, ...selectedSeats];
    show.occupiedSeat[showKey] = updatedOccupiedSeats;

    //  Tell Mongoose this array was modified
    theater.markModified('movies');


    // 8. Check if this user is booking this theater for the first time
    const existingUserBooking = await BOOKING.findOne({
      theater: theaterId,
      user: email,
      _id: { $ne: booking._id }
    });
    if (!existingUserBooking) {
      theater.total_user = (theater.total_user || 0) + 1;
    }

    // 9. Save theater document with updated data
    await theater.save();

    //stripe Gateway Initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

    //creating line items to for stripe
    const line_items = [{
      price_data: {
        currency: 'inr',
        product_data: {
          name: show.movie_name
        },
        unit_amount: Math.floor(bookingAmount) * 100
      },
      quantity: 1
    }]

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${process.env.FRONTEND_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}?session_id={CHECKOUT_SESSION_ID}`,
      line_items: line_items,
      mode: 'payment',
      metadata: {
        bookingId: booking._id.toString()
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 mins
    });


    booking.paymentLink = session.url
    booking.sessionId = session.id;

    await booking.save()

    return res.json({ book: true, url: session.url });

  } catch (error) {
    // console.error("Booking error:", error);
    return res.json({ msg: "ERROR", error: error.message });
  }
};

const getOccupiedSeats = async (req, res) => {
  try {

    const { theaterId, movieId } = req.params;
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ msg: "Missing date or time query parameters" });
    }

    const theater = await THEATER.findById(theaterId);
    if (!theater) return res.status(404).json({ msg: "Theater not found" });

    const movie = theater.movies.find(mov => mov.movieId.toString() === movieId);
    if (!movie) return res.status(404).json({ msg: "Movie not found in theater" });

    const showKey = `${date} ${time}`;
    const occupiedSeats = movie.occupiedSeat?.[showKey] || [];

    return res.json({ occupiedSeats });

  } catch (error) {
    // console.error("Error fetching occupied seats:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
}




module.exports = { getOccupiedSeats, createBooking }