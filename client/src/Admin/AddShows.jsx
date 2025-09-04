import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader';
import { CheckIcon, DeleteIcon, Star } from 'lucide-react';
import kConverter from '../lib/kConverter';
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

function AddShows() {

  const dispatch = useDispatch()
  const currency = import.meta.env.VITE_CURRENCY || '₹';
  const admin = useSelector((admin) => admin.data.adminTheater)

  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({})
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [showPrice, setShowPrice] = useState("")
  const id = localStorage.getItem('ownerId')


  function fetchNowPlayingMovies() {

    const allMovies = admin?.movies || [];
    setNowPlayingMovies(allMovies);
  }

  function handleDateTimeAdd() {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");

    if (!date || !time) return true;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] }
      }
      return prev
    })
  }

  function handleRemoveTime(date, time) {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [date]: filteredTimes
      }
    })
  }

  function convertTo12Hour(time24) {
    const [hour, minute] = time24.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12; // Convert 0 to 12
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  }

  function handleAddShow() {

    if (!selectedMovie) {
      return toast('Please Select Movie')
    }

    const show = {
      theaterId: id,
      movieId: selectedMovie,
      price: showPrice,
      date:dateTimeInput.split('T')[0],
      time:convertTo12Hour(dateTimeInput.split('T')[1])
    }

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/newShow`, show)
      .then((res) => {
        if (res.data.msg) { return toast("Show Added Successfully") }
      })
      .catch((err) => {
        console.log(err);
        alert("Movie Fetch ERROR");
      });

  }

  useEffect(() => {
    if (id, admin) {
      fetchNowPlayingMovies();
    }
  }, [admin, id])


  return nowPlayingMovies.length > 0 ? (
    <>
      <h1 className='font-medium text-2xl'>Add
        <span className='underline text-primary'> Shows</span>
      </h1>
      <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>

      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie, index) => (
            <div
              key={index}
              className={`relative max-w-40  cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}

              onClick={() => setSelectedMovie(movie._id)}
            >
              <div className="relative rounded-lg overflow-hidden h-50">
                <img
                  alt={movie.title}
                  className="w-full object-cover brightness-90"
                  src={movie.poster_path}
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-300">{kConverter(movie.vote_count)} Votes</p>
                </div>
              </div>
              {selectedMovie == movie._id && (
                <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded '>
                  <CheckIcon className='w-4 h-4 text-white' />
                </div>
              )}
              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.releaseDate}</p>
            </div>
          ))}
        </div>
      </div>
      {/* setShow Price */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min="0"
            placeholder="Enter show price"
            className="outline-none"
            type="number"
            value={showPrice} onChange={(e) => setShowPrice(e.target.value)}
          />
        </div>
      </div>

      {/* SetdateAndTime */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Select Date and Time</label>
        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            className="outline-none rounded-md"
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}

          />
          {/* <button className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer" onClick={handleDateTimeAdd}>
            Add Time
          </button> */}
        </div>
      </div>

      {/* Display Selected Times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2">Selected Date-Time</h2>
          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className="font-medium">{date}</div>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {times.map((time) => (

                    <div className="border border-primary px-2 py-1 flex items-center rounded" key={time}>
                      <span>{time}</span>
                      <DeleteIcon
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                        size={15}
                        aria-hidden="true"
                        onClick={() => handleRemoveTime(date, time)}
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer" onClick={handleAddShow}>
        Add Show
      </button>

    </>
  ) : (
    <Loader />
  )
}

export default AddShows