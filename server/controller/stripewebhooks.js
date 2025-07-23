const Stripe = require("stripe");
const BOOKING = require('../models/movieBooking');
const dotenv = require('dotenv');
dotenv.config();

const stripeWebHooks = async (req, res) => {
    console.log("💡 Stripe webhook called");

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
        console.error("❌ Signature verification failed:", error.message);
        return res.status(400).send(`WebHook Error: ${error.message}`);
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const { bookingId } = session.metadata;
            console.log("✅ Booking ID from metadata:", bookingId);

            try {

                const booking = await BOOKING.findById(bookingId);

                if (!booking) {
                    console.error("❌ No booking found for:", bookingId);
                    return res.status(404).send(`No booking found for email: ${bookingId}`);
                }

                booking.isPaid = true;
                booking.paymentLink = "";
                await booking.save();

            } catch (dbError) {
                console.error("❌ MongoDB update failed:", dbError.message);
                return res.status(500).send(`MongoDB update error ${dbError.message}`);
            }
        } else {
            console.log("ℹ️ Unhandled event type:", event.type);
        }

        res.json({ received: true });

    } catch (error) {
        console.error("❌ webhook processing error", error.message);
        res.status(500).send(`Internal Server ERROR ${error.message}`);
    }
};

module.exports = { stripeWebHooks };
