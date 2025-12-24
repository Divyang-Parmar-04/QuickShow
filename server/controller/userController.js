const BOOKING = require("../models/movieBooking")
const USER = require("../models/userModel")

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
    const {userId,movieId} = req.body
    const user = await USER.findById(userId)

    const movieIndex = user.favorite.findIndex((mov)=>mov.id==movieId)
    if(movieIndex==-1) return res.json({msg:false})

    user.favorite.splice(movieIndex,1);
    
    await user.save()

    return res.json({msg:true})

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




module.exports = { newUserCreate, addFavoriteMovie, getFavoriteMovieIds, getBookingsByEmail,deleteFavoriteMovie }