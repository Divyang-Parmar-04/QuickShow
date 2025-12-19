
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon, PlayIcon, HeartIcon } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import timeFormat from '../lib/timeFormat';
import BlurCircle from '../components/BlurCircle';
import DateSelect from '../components/DateSelect';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux'
import TheaterPage from '../components/TheaterPage';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';

function MovieDetails() {

  const navigate = useNavigate();
  const data = useSelector((data) => data.data)
  const { user } = useUser()

  const [thMovies, setThMovies] = useState(null)
  const [favorite, setFavorite] = useState(false)
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [thID, setThId] = useState()
  const [traillerLink, setTraillerLink] = useState('')

  //favorite
  function checkFavorite() {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/movie/favorite`, { userId: user?.id, id: id, newMovie: false })
      .then((res) => {
        if (res.data.msg == 'error') {
          return toast("Somthing went wrong", { icon: "❌" })
        }
        else if (res.data.msg == 'exists') {
          setFavorite(true)
        }
      })
      .catch((err) => {
        toast("Somthing went wrong", { icon: "❌" })
      })
  }

  function handleAddToFavorite() {
    if (user, id) {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/movie/favorite`, { userId: user?.id, id: id, newMovie: true })
        .then((res) => {
          toast("movie Add to Favorite", { icon: "✅" })
          setFavorite(true)
        })
        .catch((err) => {
          toast("Somthing went wrong", { icon: "❌" })
        })
    }
  }

  useEffect(() => {
    // console.log(data)
    const movie = data.movieData.find((show) => show.id == id);
    // console.log(movie)
    const thdata = data.TheaterData
      .map((th) => {
        const matchedMovies = th.movies.filter((movie) => movie.movieId == id);
        if (matchedMovies.length > 0) {
          return {
            ...th,
            movies: matchedMovies,
          };
        }
        return null;
      })
      .filter((th) => th !== null);

    setShow({ movie: movie, TheaterData: thdata });

    const link = movie?.videos?.results?.find((vid) => vid.type === "Trailer" && vid.site === "YouTube");
    setTraillerLink(`https://www.youtube.com/watch?v=${link?.key}`)

    setThMovies(thdata[0]?.movies[0])
    setThId(thdata[0]?._id)

  }, [data, id]);

  useEffect(() => {
    if (id, user) {
      checkFavorite()
    }
  }, [id, user])

  return show != null ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      {/* Movie Details Header */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img

          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
          src={
            show.movie?.poster_path!=null
              ? `https://image.tmdb.org/t/p/w500${show.movie.poster_path}`
              : "/assets/profile.png"
          }
          onError={(e) => {
            e.currentTarget.src = "/assets/logo.png";
          }}
          alt={show.movie?.title || "Movie poster"}

        />
        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-primary">{show.movie?.language}</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">{show.movie?.title}</h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {show.movie?.vote_average.toFixed(1)} User Rating
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie?.overview}
          </p>
          <p>{timeFormat(show.movie?.runtime)} • {show.movie?.genres.map((genre) => genre.name).join(", ")} • {show.movie?.release_date.split("-")[0]}</p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayIcon className="w-5 h-5" />
              <a href={traillerLink} target='blank'>Watch Trailer</a>

            </button>
            <a href="#dateSelect" className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95">
              Buy Tickets
            </a>
            {favorite ? (
              <button className="bg-red-500 p-2.5 rounded-full transition active:scale-95">
                <HeartIcon className="w-5 h-5" />
              </button>
            ) : (
              <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95" onClick={handleAddToFavorite}>
                <HeartIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Favorite Cast */}
      <p className="text-lg font-medium mt-20">Your Favorite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {show.movie?.credits.cast.map((cast, index) => (
            <div className="flex flex-col items-center text-center" key={index}>
              <img
                alt=""
                className="rounded-full h-20 md:h-20 w-20 aspect-square object-cover"
                src={'https://image.tmdb.org/t/p/w500' + cast.profile_path}
              />
              <p className="font-medium text-xs mt-3">{cast.character}</p>
            </div>
          ))}
        </div>
      </div>
      {
        show.TheaterData.length == 0 ? (
          <h1 className='py-20 text-center text-3xl'>No Theater Available</h1>
        ) : (
          <>
            <p className="text-lg font-medium mt-20">Select Theater </p>
            <TheaterPage theaters={show.TheaterData} onUpdateTheater={(data, id) => { setThMovies(data), setThId(id) }} />
            {/* Date Selection */}
            <DateSelect movie={thMovies} id={id} theaterId={thID} />
          </>
        )
      }

      {/* You May Also Like */}
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap gap-4 justify-center">
        {data.movieData.slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
      <div className="flex justify-center mt-20">
        <button className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer" onClick={() => { navigate('/movies'), scrollTo(0, 0) }} >Show more</button>
      </div>
    </div >
  ) : (
    <Loader />
  );
}

export default MovieDetails