const USER = require("../models/userModel")
const THEATER = require("../models/theaterModel")

const handleAddShow = async(req,res)=>{
  try {
    const { theaterId, movieId, price, date, time ,title ,language,format} = req.body;

    const theater = await THEATER.findById(theaterId);
    if (!theater) return res.json({ msg: "Theater not found" });

    // Check if movie already exists in theater

    let movie = theater.movies.find((mov) => mov.movieId == movieId);

    if (!movie) {

      movie = {
        movieId,
        movie_name: title,
        show_price: price || null,
        occupiedSeat: {},
        schedules: [{ date, time , languages:language , show_price:price , format:format }]
      };

      theater.movies.push(movie);
    } else {

      // Check for duplicate schedule
      const isDuplicate = movie.schedules?.some(
        (s) => s.date === date && s.time === time 
      );

      if (!isDuplicate) {
        movie.schedules.push({ date, time , languages:language ,show_price:price, format:format});
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
}

const handleDeleteShow = async(req,res)=>{
    try {
    const { mId, tId, sIndex } = req.body;

    const theater = await THEATER.findById(tId);

    if (!theater) return res.json({ msg: "Theater not found" });

    const movieIndex = theater.movies.findIndex((mov) => mov.movieId === mId);
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
    return res.json({ msg: "Internal server error" });
  }
}

module.exports = {handleAddShow,handleDeleteShow}