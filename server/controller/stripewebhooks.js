const Stripe = require("stripe");
const BOOKING = require('../models/movieBooking');
const mongoose = require('mongoose')
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
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const { bookingId } = session.metadata;
                console.log("✅ Booking ID from metadata:", bookingId);

                try {
                    const bookingObjectId = new mongoose.Types.ObjectId(bookingId);

                    const updatedBooking = await BOOKING.findByIdAndUpdate(
                        bookingObjectId,
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
                } catch (dbError) {
                    console.error("❌ MongoDB update failed:", dbError);
                    return res.status(500).send("MongoDB update error");
                }

                break;
            }

            default:
                console.log("ℹ️ Unhandled event type:", event.type);
        }

        res.json({ received: true });
    } catch (error) {
        console.error("❌ webhook processing error", error);
        res.status(500).send("Internal Server ERROR");
    }
};

module.exports = { stripeWebHooks };
