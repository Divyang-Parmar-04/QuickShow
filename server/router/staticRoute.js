const express = require('express')
const router = express.Router()

const MOVIES = require("../models/moviemodel.js");
const THEATER = require("../models/theaterModel.js");
const { createBooking, getOccupiedSeats } = require('../controller/bookingController.js');

//GETING MOVIES LIST AND THEATER LIST FOR USER
router.get('/api/movies/location/:location', async (req, res) => {
    try {
        const location = req.params.location
        const movies = await MOVIES.find({ locations: location })

        const theater = await THEATER.find({ location: location })

        return res.json({ movies: movies, theaters: theater })

    } catch (error) {
        console.log(error)
    }
})

//GETING SHOWS,THEATER,BOOKIGS,INFORMATION
router.get('/api/movies/admin/:id', async (req, res) => {
    try {
        const { id } = req.params
        const movies = await MOVIES.find();
        const theater = await THEATER.findById(id).populate('movies.movieId');
       
        return res.json({ movies: movies, theater: theater })
        
    } catch (error) {
        console.log(error)
        return res.json({ movies: "error" })
    }
})


//BOOKING ROUTES 
router.post("/api/create/booking",createBooking)

router.get("/api/booking/occupiedseat/:thaeterid/:showId",getOccupiedSeats)

module.exports = router