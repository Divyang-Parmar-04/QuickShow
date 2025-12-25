const BOOKING = require("../models/movieBooking")
const USER = require("../models/userModel")
const axios = require("axios");
const pLimit = require("p-limit").default;
const dotenv = require('dotenv');
dotenv.config();

const limit = pLimit(4); // max 4 concurrent requests

//new User Create
const newUserCreate = async (req, res) => {
  try {
    const { fullName, id, email, imageUrl } = req.body

    const user = await USER.findOne({ email: email, _id: id })

    if (user) { return res.json({ msg: "exists" }) }

    const newUser = await USER.create({
      _id: id,
      name: fullName,
      email: email,
      image: imageUrl
    })

    if (newUser) return res.json({ msg: "success" })

    return res.json({ msg: "error" })


  } catch (error) {
    console.log(error)
    return res.json({ success: false, meg: "error" })
  }
}

//ADD to Favorite

const addFavoriteMovie = async (req, res) => {
  try {
    const { userId, id, newMovie } = req.body;

    // Step 1: Find the user
    const user = await USER.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Step 2: Check if the movie already exists in favorites
    const alreadyExists = user.favorite.some(movie => movie.id === id);

    if (alreadyExists) {
      return res.json({ msg: "exists" });
    }

    // Step 3: Add the movie ID to favorites

    if (newMovie) {
      user.favorite.push({ id: id });
      // Step 4: Save the updated user
      await user.save();
      return res.json({ msg: "success" });
    }

    return res.json({ msg: "not exsist" })


  } catch (error) {
    // console.error(error);
    return res.status(500).json({ msg: "error", error: error.message });
  }
};

//DELETE FAVORITE

const deleteFavoriteMovie = async (req, res) => {
  try {
    const { userId, movieId } = req.body
    const user = await USER.findById(userId)

    const movieIndex = user.favorite.findIndex((mov) => mov.id == movieId)
    if (movieIndex == -1) return res.json({ msg: false })

    user.favorite.splice(movieIndex, 1);

    await user.save()

    return res.json({ msg: true })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "error", error: error.message });
  }
}

//get all movieID
const getFavoriteMovieIds = async (req, res) => {
  try {
    const { userId } = req.body;

    // Step 1: Find the user
    const user = await USER.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Step 2: Extract all movie IDs from the favorite array
    const favoriteMovieIds = user.favorite.map(movie => movie.id);

    // Step 3: Return the list of movie IDs
    return res.json({ msg: favoriteMovieIds });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "error", error: error.message });
  }
};

//GET ALL BOOKINGS
const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Step 2: Find bookings using the user ID and populate the movie `show`

    const bookings = await BOOKING.find({ user: email }).sort({ createdAt: -1 }); // optional: newest first

    return res.json({ bookings });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
};

//GET All MOVIES
const fetchMoviesByIds = async (ids = []) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const uniqueIds = [...new Set(ids)];

  const requests = uniqueIds.map(id =>
    limit(async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
              append_to_response: "credits,videos",
            },
            timeout: 20000, // increased timeout
          }
        );
        return res.data;
      } catch (err) {
        console.error(`TMDB failed for ID ${id}`);
        return null; // don’t break all requests
      }
    })
  );

  const results = await Promise.all(requests);
  return results.filter(Boolean); // remove failed ones
};





module.exports = { newUserCreate, addFavoriteMovie, getFavoriteMovieIds, getBookingsByEmail, deleteFavoriteMovie ,fetchMoviesByIds }