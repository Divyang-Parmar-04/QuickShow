import { createBrowserRouter, createRoutesFromElements, Route, Router } from "react-router-dom";
import App from "./App";
import Home from './pages/Home'
import MoviesDetails from './pages/MovieDetails'
import Movies from './pages/Movies'
import SeatLayout from './pages/SeatLayout'
import MyBookigns from './pages/MyBookings'
import Favorite from './pages/Favorite'



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element = {<App/>}>
      <Route path="" element = {<Home/>}/>
      <Route path="movies" element = {<Movies/>}/>
      <Route path="movies/:id" element = {<MoviesDetails/>}/>
      <Route path="movies/:id/:date" element = {<SeatLayout/>}/>
      <Route path="my-bookings" element = {<MyBookigns/>}/>
      <Route path="favorite" element = {<Favorite/>}/>
    </Route>    
    </>
  )
)

export default router