const Stripe = require("stripe");
const BOOKING = require('../models/movieBooking');
const dotenv = require('dotenv');
dotenv.config();

const stripeWebHooks = async (req, res) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_KEY
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // ✅ Use this event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { bookingId } = session.metadata;
      if (!bookingId) {
        console.warn("bookingId not found in metadata");
        return res.status(400).send("Missing booking ID in metadata");
      }

      await BOOKING.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentLink: ""
      });

      console.log("Booking updated:", bookingId);
    } else {
      console.log("Unhandled event type:", event.type);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error", err);
    res.status(500).send("Internal Server ERROR");
  }
};

module.exports = { stripeWebHooks };
