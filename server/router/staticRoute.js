const express = require('express')
const router = express.Router()

const THEATER = require("../models/theaterModel.js");
const BOOKING = require('../models/movieBooking.js');

const { createBooking, getOccupiedSeats } = require('../controller/bookingController.js');
const { checkPaymentStatus } = require('../controller/stripePaymentValidation.js');
const { fetchMoviesByIds } = require("../controller/userController.js");
const { getNowPlayingMovies, discoverMovies, searchMovieByName } = require('../controller/adminController.js');

//GETING MOVIES LIST AND THEATER LIST FOR USER
router.get("/api/movies/location/:location", async (req, res) => {
  try {
    const { location } = req.params;

    const theaters = await THEATER.find({ location });

    // collect unique movie IDs
    const movieIds = [
      ...new Set(
        theaters.flatMap(
          t => t?.movies?.map(m => m.movieId) || []
        )
      ),
    ];

    // ⚠️ LIMIT movies to avoid TMDB timeout
    const limitedMovieIds = movieIds.slice(0, 12);

    let movies = [];
    if (limitedMovieIds.length) {
      movies = await fetchMoviesByIds(limitedMovieIds);
    }

    // console.log(movies)

    return res.json({
      theaters,
      movies,
      totalMoviesFound: movieIds.length,
    });

  } catch (error) {
    console.error("Location movies error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});


//GETING SHOWS,THEATER,BOOKIGS,INFORMATION
router.get('/api/movies/admin/:id', async (req, res) => {
  try {
    const { id } = req.params
    const theater = await THEATER.findById(id);
    const booking = await BOOKING.find({ theater: id })

    return res.json({ theater: theater, bookings: booking })

  } catch (error) {
    console.log(error)
    return res.json({ movies: "error" })
  }
})

//BOOKING ROUTES 
router.post("/api/create/booking", createBooking)

//CHECKED PAYMENT STATUS
router.get("/api/payment-status/:sessionId", checkPaymentStatus);

router.get("/api/booking/occupiedseat/:thaeterid/:showId", getOccupiedSeats)

//GET NOWPLAYING MOVIES FOR ADMIN

router.get("/api/admin/tmdb/movies", getNowPlayingMovies)

// Discover movies
router.get("/api/admin/tmdb/discover", async (req, res) => {
  try {
    const movies = await discoverMovies(req.query);
    res.json({ results: movies });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies" });
  }
});

// Search movie by name
router.get("/api/admin/tmdb/search", async (req, res) => {
  try {
    const movies = await searchMovieByName(req.query.q);
    res.json({ results: movies });
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
});

//GET MOVIES BY ID

router.get("/api/admin/tmdb/search/id", async (req, res) => {
  try {
    const ids = req.query

    if (ids) {
      movies = await fetchMoviesByIds(ids);
      return res.json({ data: movies,msg:"True" })
    }

    return res.json({data:[],msg:"NO Movies Found"})

  } catch (error) {
    console.log(error)
    return res.json({ data: [], msg: error })
  }
})

module.exports = router