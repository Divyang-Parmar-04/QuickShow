import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from "react"
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux"
import { setlocation, setMoviesData, setTheaterData } from './store/dataslice'

function App() {

  const loc = localStorage.getItem('location')

  const location = useSelector((data)=>data.data.location)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!location) {
       dispatch(setlocation(loc))
       return ;
    };

    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movies/location/${location}`);
        console.log(response.data)
        dispatch(setTheaterData(response.data.theaters))
        dispatch(setMoviesData(response.data.movies))
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, [location,dispatch]);
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
