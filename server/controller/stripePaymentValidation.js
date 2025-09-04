const Stripe = require("stripe");
const BOOKING = require("../models/movieBooking");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkPaymentStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ msg: "Session ID is required" });
    }

    // 1. Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 2. Check if payment is successful
    if (session.payment_status === "paid") {
      // 3. Update the booking document in DB
      const updatedBooking = await BOOKING.findOneAndUpdate(
        { sessionId },
        { isPaid: true },
        { new: true }
      );

      return res.json({ updated: true, booking: updatedBooking });
    }

    return res.json({ updated: false });
  } catch (err) {
    console.error("❌ Error checking payment status:", err);
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

module.exports = { checkPaymentStatus };
