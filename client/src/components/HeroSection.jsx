import { ClockIcon, CalendarIcon, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import timeFormat from '../lib/timeFormat'
import { useSelector } from 'react-redux'
import WelcomePage from './WelcomePage'


function HeroSection() {
  const navigate = useNavigate()
  const mData = useSelector((data) => data.data.movieData)
  // console.log(mData)

  const [movie, setMovie] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    if (mData) {
      const randomMovie = mData[Math.floor(Math.random() * mData.length)];
      setMovie(randomMovie);
    }
  }, [mData])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bgImage = isMobile
    ? movie?.poster_path
    : movie?.backdrop_path;


  return (
    <>
      {movie ? (
        <div className={`flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen `} style={{ backgroundImage: bgImage
          ? `url(https://image.tmdb.org/t/p/original${bgImage})`
          : "none", }}>
          <div className="absolute inset-0 bg-black/50">
          </div>
          <img
            alt=""
            className="max-h-11 lg:h-11 mt-20 z-20"
            loading='lazy'
            src={"https://image.tmdb.org/t/p/original" + movie?.production_companies[0]?.logo_path}

          />
          <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-150 z-20">
            {movie?.title}
          </h1>

          <div className="flex items-center gap-4 text-white z-20">
            <span>{movie?.genres.map((genre) => genre.name).join(", ")}</span>

            <div className="flex items-center gap-1 z-20 text-white ">
              <CalendarIcon className="w-4.5 h-4.5" />{movie?.release_date.split("-")[0]}
            </div>

            <div className="flex items-center gap-1 z-20 text-white">
              <ClockIcon className="w-4.5 h-4.5" />
              <span>{timeFormat(movie?.runtime)}</span>
            </div>
          </div>

          <p className="max-w-md text-white z-20">
            {movie?.overview}
          </p>

          <button className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer z-20" onClick={() => { navigate(`/movies/${movie.id}`), scrollTo(0, 0) }}>
            Book Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <WelcomePage />
      )}

    </>
  )
}

export default HeroSection