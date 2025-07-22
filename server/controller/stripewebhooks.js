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
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Make sure metadata and bookingId exist
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
          console.error("No bookingId found in session metadata");
          break;
        }

        // Update booking: mark as paid, remove payment link
        await BOOKING.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: ""
        });

        console.log("✅ Booking marked as paid for ID:", bookingId);
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { stripeWebHooks };
