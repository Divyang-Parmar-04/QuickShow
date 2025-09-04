
import MovieCard from '../components/MovieCard'
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';


function Favorite() {

  const data = useSelector((data) => data.data.movieData);
  const [movies, setMovies] = useState([])
  const { user } = useUser()


  useEffect(() => {
    if (user) {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/movie/favorite/ids`, { userId: user?.id })
        .then((res) => {
          if (res.data.msg == 'error') {
            return toast("Somthing went wrong", { icon: "❌" })
          }
          // Filter the movie data
          const filteredMovies = data.filter(movie => res.data.msg.includes(movie._id));
          setMovies(filteredMovies);

        })
        .catch((err) => {
          console.log(err)
          toast("Somthing went wrong", { icon: "❌" })
        })
    }
  }, [user])

  return movies.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <div className="absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl" style={{ inset: "150px auto auto 0px" }} />
      <div className="absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl" style={{ inset: "auto 50px 50px auto" }} />

      <h1 className="text-lg font-medium my-4 ml-15">Favorite Movies</h1>

      <div className="flex flex-wrap max-sm:justify-center gap-8 justify-center ">
        {movies.map((movie, index) => (
          <MovieCard key={index} movie={movie} fav={true} />
        ))}
      </div>
    </div>
  ) : (
    <div className="text-center py-20 h-screen flex flex-col items-center justify-center ">
      <h2 className="text-[30px] font-semibold">You do Not have any Fovorite Movies</h2>
      <p className="text-sm text-gray-400">Please check back later.</p>
    </div>
  )
}

export default Favorite