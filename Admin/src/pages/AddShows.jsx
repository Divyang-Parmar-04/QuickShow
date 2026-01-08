import React, { useEffect, useState } from 'react'
import { CheckIcon, DeleteIcon, Star, Ellipsis, ChevronDown, ChevronUp } from 'lucide-react';
import kConverter from '../lib/kConverter';
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import SkelitonCard from '../components/SkelitonCard';

function AddShows() {

  const currency = import.meta.env.VITE_CURRENCY || '₹';
  const admin = useSelector((admin) => admin.data.adminTheater)

  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({})
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [showPrice, setShowPrice] = useState("")
  const [sName, setSName] = useState('')
  const [isDown, setIsDown] = useState(false)

  const [genre, setGenre] = useState(null);
  const [language, setLanguage] = useState(null);
  const [region, setRegion] = useState(null);
  const [year, setYear] = useState('2025')
  const [movieLang, setMovieLang] = useState("");
  const [format, setFormat] = useState("");

  const [firstload,setFirstLoad] = useState(true)


  const id = localStorage.getItem('ownerId')

  //discover movies by fillters
  const discoverMovies = async (filters) => {
    setNowPlayingMovies([])
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/tmdb/discover`, {
        params: filters,
      });

      return res.data.results || [];
      
    } catch (error) {
      console.error("Discover error:", error);
      return [];
    }
    
  };

  const searchMovieByName = async (query) => {
    if (!query?.trim()) return [];

    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/tmdb/search`, {
        params: { q: query },
      });
      return res.data.results || [];
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  };

  const handleSearch = async () => {
    if (sName != '') {
      setNowPlayingMovies([])
      const movies = await searchMovieByName(sName);
      setSName('')
      if (movies.length == 0) toast("No Movie was Found")
      setNowPlayingMovies(movies);

    }
    else {
      toast("Enter movie name")
    }
  };


  async function fetchNowPlayingMovies() {

    setNowPlayingMovies([]);
    try {

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/tmdb/movies`)
      setNowPlayingMovies(res.data.data.results)

    } catch (error) {
      console.log(error)
    }
    setFirstLoad(false)
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

    const movieTitle = nowPlayingMovies.filter((movie) => movie.id == selectedMovie)[0].title

    const show = {
      theaterId: id,
      movieId: selectedMovie,
      price: showPrice,
      title: movieTitle,
      date: dateTimeInput.split('T')[0],
      language: movieLang,
      format: format,
      time: convertTo12Hour(dateTimeInput.split('T')[1])
    }


    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/newShow`, show)
      .then((res) => {
        if (res.data.msg) { return toast(" ✅ Show Added Successfully") }
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

  useEffect(() => {
    const fetchMovies = async () => {
      const movies = await discoverMovies({ genre, language, region, year });
      setNowPlayingMovies(movies);
    };
    if(!firstload)fetchMovies();

  }, [genre, language, region, year]);

  return (
    <>
      <h1 className='font-medium text-2xl'>Add
        <span className='underline text-primary'> Shows</span>
      </h1>
      <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>

      {/* Search Movie by name  */}
      <div className="mt-5 ">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className='flex items-center gap-2 '>
          <div className="inline-flex items-center gap-2 border bg-gray-950 border-gray-600 px-3 py-2 rounded-md">
            <input
              min="0"
              placeholder="Enter movie name"
              className="outline-none"
              type="text"
              required
              value={sName} onChange={(e) => setSName(e.target.value)}
            />
            <button className='cursor-pointer active:text-blue-600' onClick={handleSearch}>Search</button>
          </div>
          <div className="flex flex-wrap gap-4">

            {/* 🎭 Genre */}
            <div className="inline-flex items-center gap-2 border border-gray-600 rounded-md">
              <select
                className=" bg-gray-950 px-6 rounded-md py-2 text-white outline-none cursor-pointer"
                onChange={(e) => setGenre(e.target.value || null)}
              >
                <option value="">Genre</option>
                <option value="28">Action</option>
                <option value="35">Comedy</option>
                <option value="18">Drama</option>
                <option value="10749">Romance</option>
                <option value="27">Horror</option>
                <option value="53">Thriller</option>
              </select>
            </div>

            {/* 🌍 Language */}
            <div className="inline-flex items-center gap-2 border border-gray-600 rounded-md">
              <select
                className=" bg-gray-950 px-6 rounded-md py-2 text-white outline-none cursor-pointer"
                onChange={(e) => setLanguage(e.target.value || null)}
              >
                <option value="">Language</option>
                <option value="hi">Hindi</option>
                <option value="en">English</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="ml">Malayalam</option>
                <option value="kn">Kannada</option>
              </select>
            </div>

            {/* 🎬 Industry */}
            <div className="inline-flex items-center gap-2 border border-gray-600 rounded-md">
              <select
                className="bg-gray-950 px-6 rounded-md py-2 text-white outline-none cursor-pointer"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "bollywood") {
                    setLanguage("hi");
                    setRegion("IN");
                  } else if (val === "hollywood") {
                    setLanguage("en");
                    setRegion(null);
                  } else {
                    setLanguage(null);
                    setRegion(null);
                  }
                }}
              >
                <option value="">Industry</option>
                <option value="bollywood">Bollywood</option>
                <option value="hollywood">Hollywood</option>
              </select>
            </div>

            {/* 🌍 Year */}
            <div className="inline-flex items-center gap-2 border border-gray-600 rounded-md">
              <select
                className=" bg-gray-950 px-6 rounded-md py-2 text-white outline-none cursor-pointer"
                onChange={(e) => setYear(e.target.value || null)}
              >
                <option value="">Year</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>

              </select>
            </div>

          </div>


          <button className='ml-2 cursor-pointer active:text-red-500' onClick={() => setIsDown((prev) => prev = !prev)}>{isDown ? (<ChevronUp />) : (<ChevronDown />)}</button>
        </div>

      </div>

      <div className={`pb-4 mt-2 ${isDown ? " flex w-270" : "overflow-x-auto"}`}>
        <div className="group flex flex-wrap gap-4 mt-4 w-max">

          {nowPlayingMovies?.length > 0 ?

            nowPlayingMovies.map((movie, index) => (
              <div
                key={index}
                className={`relative max-w-40  cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}

                onClick={() => setSelectedMovie(movie.id)}
              >
                <div className="relative rounded-lg overflow-hidden h-50">
                  <img
                    alt={movie.title}
                    className="w-full object-cover brightness-90"
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/fallback.jpg"
                    }
                  />
                  <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                    <p className="flex items-center gap-1 text-gray-400">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      {movie.vote_average.toFixed(1)}
                    </p>
                    <p className="text-gray-300">{kConverter(movie.vote_count)} Votes</p>
                  </div>
                </div>
                {selectedMovie == movie.id && (
                  <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded '>
                    <CheckIcon className='w-4 h-4 text-white' />
                  </div>
                )}
                <p className="font-medium truncate">{movie.title}</p>
                <p className="text-gray-400 text-sm">{movie.releaseDate}</p>
              </div>
            ))
            : (
              <>
                {Array(5).fill(0).map((_, index) => (
                  <SkelitonCard index={index} key={index} />
                ))}
              </>
            )}


        </div>
      </div>
      {/* setShow Price */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 bg-gray-950 px-3 py-2 rounded-md">
          <p className="text-white text-sm">{currency}</p>
          <input
            min="0"
            placeholder="Enter show price"
            className="outline-none text-white"
            type="number"
            value={showPrice} onChange={(e) => setShowPrice(e.target.value)}
          />
        </div>
      </div>

      {/* SetdateAndTime */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Select Date and Time</label>
        <div className="inline-flex gap-5 border border-gray-600 bg-gray-950 p-1 pl-3 rounded-lg">
          <input
            className="outline-none rounded-md"
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
          />
        </div>
      </div>

      {/* Select Language */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Select Language</label>
        <div className="inline-flex gap-5 border border-gray-600 bg-gray-950 p-1 pl-3 rounded-lg">
          <select
            className="outline-none rounded-md bg-gray-950"
            value={movieLang}
            onChange={(e) => setMovieLang(e.target.value)}
          >
            <option value="">Choose Language</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Kannada">Kannada</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Marathi">Marathi</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Bengali">Bengali</option>
            <option value="Punjabi">Punjabi</option>
          </select>
        </div>
      </div>

      {/* Select Movie Format */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Select Format</label>
        <div className="inline-flex gap-5 border border-gray-600 bg-gray-950 p-1 pl-3 rounded-lg">
          <select
            className="outline-none rounded-md bg-gray-950"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="">Choose Format</option>
            <option value="2D">2D</option>
            <option value="3D">3D</option>
            <option value="IMAX">IMAX</option>
            <option value="IMAX-3D">IMAX 3D</option>
            <option value="4DX">4DX</option>
            <option value="DOLBY">Dolby Atmos</option>
          </select>
        </div>
      </div>



      <button className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer" onClick={handleAddShow}>
        Add Show
      </button>
    </>
  )
}

export default AddShows