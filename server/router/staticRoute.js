const express = require('express')
const router = express.Router()

const THEATER = require("../models/theaterModel.js");
const { createBooking, getOccupiedSeats } = require('../controller/bookingController.js');
const BOOKING = require('../models/movieBooking.js');
const { checkPaymentStatus } = require('../controller/stripePaymentValidation.js');

//GETING MOVIES LIST AND THEATER LIST FOR USER
router.get('/api/movies/location/:location', async (req, res) => {
    try {
        const location = req.params.location

        const theater = await THEATER.find({ location: location })

        return res.json({theaters: theater })

    } catch (error) {
        console.log(error)
    }
})

//GETING SHOWS,THEATER,BOOKIGS,INFORMATION
router.get('/api/movies/admin/:id', async (req, res) => {
    try {
        const { id } = req.params
        const theater = await THEATER.findById(id);
        const booking = await BOOKING.find({theater:id})
       
        return res.json({ theater: theater,bookings:booking})
        
    } catch (error) {
        console.log(error)
        return res.json({ movies: "error" })
    }
})


//BOOKING ROUTES 
router.post("/api/create/booking",createBooking)

//CHECKED PAYMENT STATUS
router.get("/api/payment-status/:sessionId", checkPaymentStatus);

router.get("/api/booking/occupiedseat/:thaeterid/:showId",getOccupiedSeats)

module.exports = router