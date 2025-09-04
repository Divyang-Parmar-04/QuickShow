
import MovieCard from '../components/MovieCard'
import { useEffect,useState, } from 'react';
import { useSelector } from 'react-redux';

function Movies() {

  const data = useSelector((data) => data.data.movieData);
  const [movies, setMovies] = useState([])

  useEffect(() => {
    setMovies(data)
  }, [data])


  return movies.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] pb-3">
      <div className="absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl" style={{ inset: "150px auto auto 0px" }} />
      <div className="absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl" style={{ inset: "auto 50px 50px auto" }} />

      <h1 className="text-lg font-medium my-4 ml-15">Now Showing</h1>

      <div className="flex flex-wrap max-sm:justify-center max-md:justify-center justify-center gap-8">
        {movies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
    </div>
  ) : (
    <div className="text-center py-20">
      <h2 className="text-lg font-semibold">No Movies Available</h2>
      <p className="text-sm text-gray-400">Please check back later.</p>
    </div>
  )
}

export default Movies