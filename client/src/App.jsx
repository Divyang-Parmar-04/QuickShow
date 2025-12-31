import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from "react"
import axios from 'axios';
// const footer = React.lazy(()=>import("./components/Footer"))
import { useDispatch, useSelector } from "react-redux"
import { setlocation, setMoviesData, setTheaterData } from './store/dataslice'

function App() {

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

  const loc = localStorage.getItem('location')

  const location = useSelector((data) => data.data.location)

  const dispatch = useDispatch()

  const fetchMoviesByIds = async (ids = []) => {
    if (!ids.length) return [];

    try {
      const requests = ids.map(id =>
        axios.get(`${BASE_URL}/movie/${id}`, {
          params: {
            api_key: API_KEY,
            append_to_response: "credits,videos"  
          }
        })
      );

      const responses = await Promise.all(requests);
      return responses.map(res => res.data);

    } catch (error) {
      console.error("TMDB fetch error:", error);
      return [];
    }
  };

  useEffect(() => {

    if (!location) {
      dispatch(setlocation(loc))
      return;
    };

    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movies/location/${location}`);
        dispatch(setTheaterData(response.data.theaters))
        console.log(response.data)

        if (response.data.movies.length == 0) alert("NO Movies was found on Selected Location")
        else {
          dispatch(setMoviesData(response.data.movies))
        }

        // const moviesid = [
        //   ...new Set(
        //     response.data.theaters.flatMap(
        //       mov => mov?.movies?.map(m => m.movieId) || []
        //     )
        //   )
        // ];

        // if (moviesid.length == 0) alert("NO Movies was found on Selected Location")
        // else {

        //   // console.log(moviesid)

        //   console.log(movies)

        // }


      } catch (error) {
        console.error("Failed to fetch movies: ", error);
      }
    };

    fetchMovies();
  }, [location, dispatch]);
  return (
    <>
      <Toaster />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
