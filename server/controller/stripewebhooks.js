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
    console.error("Stripe signature error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Get bookingId from metadata
        const { bookingId } = session.metadata;
        console.log("✅ Payment complete for booking:", bookingId);

        // Mark the booking as paid
        await BOOKING.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: ""
        });

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { stripeWebHooks };
