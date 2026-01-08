const USER = require("../models/userModel")
const THEATER = require("../models/theaterModel")
const axios = require("axios")

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const handleAddShow = async (req, res) => {
  try {
    const { theaterId, movieId, price, date, time, title, language, format } = req.body;

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
        schedules: [{ date, time, languages: language, show_price: price, format: format }]
      };

      theater.movies.push(movie);
    } else {

      // Check for duplicate schedule
      const isDuplicate = movie.schedules?.some(
        (s) => s.date === date && s.time === time
      );

      if (!isDuplicate) {
        movie.schedules.push({ date, time, languages: language, show_price: price, format: format });
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

const handleDeleteShow = async (req, res) => {
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

const getNowPlayingMovies = async (req, res) => {
  try {

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&region=IN&with_original_language=hi|ta|te|ml|kn`;

    const response = await fetch(url)
    const data = await response.json()

    return res.json({ data: data })

  } catch (error) {
    console.log(error)
    return res.json({ data: [], msg: "error" })
  }
}

const discoverMovies = async ({
  genre,
  language,
  region,
  year,
  page = 1,
}) => {
  try {
    const params = {
      api_key: API_KEY,
      page,
      sort_by: "primary_release_date.desc",
    };

    if (year) params.primary_release_year = year;
    if (genre) params.with_genres = genre;
    if (language) params.with_original_language = language;
    if (region) params.region = region;

    const res = await axios.get(`${BASE_URL}/discover/movie`, { params });
    return res.data.results || [];
  } catch (err) {
    console.error("Discover error:", err.message);
    return [];
  }
};

const searchMovieByName = async (query) => {
  if (!query) return [];

  try {
    const res = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
        include_adult: false,
      },
    });
    return res.data.results || [];
  } catch (err) {
    console.error("Search error:", err.message);
    return [];
  }
};


module.exports = { handleAddShow, handleDeleteShow, getNowPlayingMovies ,discoverMovies,searchMovieByName}