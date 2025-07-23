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
    return res.status(400).send(`WebHook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { bookingId } = session.metadata;

        console.log("Booking ID from metadata:", bookingId);

        const updatedBooking = await BOOKING.findByIdAndUpdate(
          bookingId,
          {
            isPaid: true,
            paymentLink: ""
          },
          { new: true }
        );

        if (updatedBooking) {
          console.log("✅ Booking updated successfully:", updatedBooking._id);
        } else {
          console.error("❌ Booking not found with ID:", bookingId);
        }

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("webHook processing error", error);
    res.status(500).send("Internal Server ERROR");
  }
};

module.exports = { stripeWebHooks };
