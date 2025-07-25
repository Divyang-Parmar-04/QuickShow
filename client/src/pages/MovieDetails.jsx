import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon, PlayIcon, HeartIcon } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import timeFormat from '../lib/timeFormat';
import BlurCircle from '../components/BlurCircle';
import DateSelect from '../components/DateSelect';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';


function MovieDetails() {
   
  const navigate = useNavigate();

  const { id } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    const movie = dummyShowsData.find((show) => show._id === id);
    setShow({ movie: movie, dateTime: dummyDateTimeData });
  }, [id]);

  return show!=null ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      {/* Movie Details Header */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          alt=""
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
          src={show.movie.poster_path}
        />
        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-primary">ENGLISH</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">{show.movie.title}</h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {show.movie.vote_average.toFixed(1)} User Rating
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie.overview}
          </p>
          <p>{timeFormat(show.movie.runtime)} • {show.movie.genres.map((genre) => genre.name).join(", ")} • {show.movie.release_date.split("-")[0]}</p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayIcon className="w-5 h-5" />
              Watch Trailer
            </button>
            <a href="#dateSelect" className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95">
              Buy Tickets
            </a>
            <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
              <HeartIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Favorite Cast */}
      <p className="text-lg font-medium mt-20">Your Favorite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {show.movie.casts.map((cast, index) => (
            <div className="flex flex-col items-center text-center" key={index}>
              <img
                alt=""
                className="rounded-full h-20 md:h-20 aspect-square object-cover"
                src={cast.profile_path}
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <DateSelect dateTime={show.dateTime} id={id}/>

      {/* You May Also Like */}
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap gap-4 justify-center">
        {dummyShowsData.slice(0,4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
      <div className="flex justify-center mt-20">
        <button className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer" onClick={()=>{navigate('/movies'),scrollTo(0,0)}} >Show more</button>
      </div>
    </div>
  ) : (
    <Loader/>
  );
}

export default MovieDetails