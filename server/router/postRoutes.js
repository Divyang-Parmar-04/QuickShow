const express = require('express')
const router = express.Router()

const MOVIES = require("../models/moviemodel.js");
const THEATER = require("../models/theaterModel.js");
const { newUserCreate, addFavoriteMovie, getFavoriteMovieIds, getBookingsByEmail, deleteFavoriteMovie } = require('../controller/userController.js');
const { createBooking, getOccupiedSeats } = require('../controller/bookingController.js');
const { handleAddShow, handleDeleteShow } = require('../controller/adminController.js');

//new User/exist user
router.post("/api/create/newUser",newUserCreate)

//addTOFavorite
router.post("/api/movie/favorite",addFavoriteMovie)

//GET all Favorites
router.post("/api/movie/favorite/ids",getFavoriteMovieIds)

//DELETE FAVORITE MOVIE
router.post("/api/movie/favorite/delete",deleteFavoriteMovie)

//GET USERS BOOKINGS
router.get("/api/movie/mybookings/:email",getBookingsByEmail)

//NEW BOOKING 
router.post("/api/movie/newbooking",createBooking)

//GET OQUPIED SEAT
router.get("/api/theater/:theaterId/movie/:movieId/occupied-seats",getOccupiedSeats)


//NEW SHOW ADD
router.post("/api/admin/newShow",handleAddShow);

//DELETE SHOW FROM LIST
router.post("/api/admin/delete/show", handleDeleteShow);




module.exports = router