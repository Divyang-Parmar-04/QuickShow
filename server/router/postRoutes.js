const express = require('express')
const router = express.Router()

const MOVIES = require("../models/moviemodel.js");
const THEATER = require("../models/theaterModel.js")

router.post("/api/admin/newShow", async (req, res) => {
  try {
    const { theaterId, movieId, price, date, time } = req.body;

    const theater = await THEATER.findById(theaterId);
    if (!theater) return res.json({ msg: "Theater not found" });

    // Check if movie already exists in theater
    let movie = theater.movies.find((mov) => mov.movieId.toString() === movieId);

    if (!movie) {
      const movieDetails = await MOVIES.findById(movieId);
      if (!movieDetails) return res.json({ msg: "Movie not found in DB" });

      movie = {
        movieId,
        movie_name: movieDetails.title,
        show_price: price || null,
        occupiedSeat: {},
        schedules: [{ date, time }]
      };

      theater.movies.push(movie);
    } else {
      // Check for duplicate schedule
      const isDuplicate = movie.schedules?.some(
        (s) => s.date === date && s.time === time
      );

      if (!isDuplicate) {
        movie.schedules.push({ date, time });
      }

      if (price !== undefined && price !== null) {
        movie.show_price = price;
      }
    }

    await theater.save();
    return res.json({ msg: "Show added/updated successfully" });

  } catch (error) {
    console.error(error);
    return res.json({ msg: "Internal server error" });
  }
});

//DELETE SHOW FROM LIST
router.post("/api/admin/delete/show", async (req, res) => {
  try {
    const { mId, tId, sIndex } = req.body;

    const theater = await THEATER.findById(tId);
    if (!theater) return res.json({ msg: "Theater not found" });

    const movieIndex = theater.movies.findIndex((mov) => mov.movieId.toString() === mId);
    if (movieIndex === -1) return res.json({ msg: "Movie not found in this theater" });

    const movie = theater.movies[movieIndex];

    // Remove specific schedule by index
    if (sIndex >= 0 && sIndex < movie.schedules.length) {
      movie.schedules.splice(sIndex, 1);
    }

    // If no schedules left, remove the movie
    if (movie.schedules.length === 0) {
      theater.movies.splice(movieIndex, 1);
    }

    await theater.save();
    return res.json({ msg: true });

  } catch (error) {
    console.error(error);
    return res.json({ msg: "Internal server error" });
  }
});


module.exports = router