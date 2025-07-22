const Stripe = require("stripe")
const BOOKING = require('../models/movieBooking')

const dotenv = require('dotenv')
dotenv.config()

const stripeWebHooks = async (req, res) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY)
    } catch (error) {
        return res.status(400).send(`WebHook Error :  ${error.message}`)
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                })

                const session = sessionList.data[0];
                const { bookingId } = session.metadata

                console.log(bookingId)

                await BOOKING.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                })}
                break;

            default:
                console.log('Unhandled event type : ',event.type)
        }
        res.json({received:true})
    } catch (error) {
      console.error("webHook processing error",err);
      res.status(500).send("Internal Server ERROR")
    }

}

module.exports = { stripeWebHooks }