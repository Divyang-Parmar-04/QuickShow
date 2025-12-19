
import MovieCard from '../components/MovieCard'
import { useEffect, useState, } from 'react';
import { useSelector } from 'react-redux';
import MovieFiltters from '../components/MovieFiltters';
import { FunnelIcon } from 'lucide-react'
import SkeletonCard from '../components/SkeletonCard';


function Movies() {

  const data = useSelector((data) => data.data.movieData);
  const [movies, setMovies] = useState([])
  const [openFilter, setOpenFilter] = useState(false)


  // fillters
  const [sName, setSName] = useState('');
  const [genre, setGenre] = useState(null);
  const [language, setLanguage] = useState(null);
  const [region, setRegion] = useState(null);
  const [year, setYear] = useState('2025');
  const [isLoading, setIsLoading] = useState(true)



  function handleSearchByName() {
    setIsLoading(true)
    if (sName != '') {
      // console.log(sName)
      const movs = data.filter(movie =>
        movie.title.toLowerCase().includes(sName.toLowerCase())
      )

      setMovies(movs)
      setSName('')
    }
    else {
      setMovies(data)
    }
     setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }


  //apply more filltrs
  function applyFilters(movies, filters) {
    const {
      sName,
      genre,
      language,
      region,
      year,
    } = filters;

    return movies.filter(movie => {

      // 🔍 Search by name
      if (sName && !movie.title?.toLowerCase().includes(sName.toLowerCase())) {
        return false;
      }

      // 🎭 Genre (TMDB genre ids)
      if (genre && !movie.genre_ids?.includes(Number(genre))) {
        return false;
      }

      // 🌍 Language
      if (language && movie.original_language !== language) {
        return false;
      }

      // 🌎 Region (production country)
      if (region) {
        const countries = movie.production_countries?.map(c => c.iso_3166_1);
        if (!countries?.includes(region)) return false;
      }

      // 📅 Release Year
      if (year && new Date(movie.release_date).getFullYear().toString() !== year) {
        return false;
      }

      return true;
    });
  }

  function handleMoreSearchFillters() {
    setIsLoading(true);

    const result = applyFilters(data, {
      sName,
      genre,
      language,
      region,
      year,
    });

    setMovies(result)
    // simulate async feel (optional)
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }

  // clear filltters

  function onHandleClear() {
    setIsLoading(true)
    setMovies(data)

    setTimeout(() => {
      setIsLoading(false);
    }, 800);

  }

  useEffect(() => {
    setMovies(data)
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, [data])




  return (

    <>
      <button
        onClick={() => setOpenFilter(true)}
        className="px-6 py-2 rounded-full bg-blue-950  cursor-pointer right-10 top-40 fixed z-10 "
      >
        <FunnelIcon />
      </button>
      {openFilter && <MovieFiltters close={() => setOpenFilter(false)} sName={sName} genre={genre} language={language} region={region} year={year} setGenre={setGenre} setLanguage={setLanguage} setSName={setSName} setYear={setYear} setRegion={setRegion} onHandleSearch={handleSearchByName} onHandleMoreSearchFillters={handleMoreSearchFillters} onHandleClear={onHandleClear} />}
      {movies.length > 0 ? (
        <>


          <div className="relative my-30 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] pb-10">
            <div className="absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl" style={{ inset: "150px auto auto 0px" }} />
            <div className="absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl" style={{ inset: "auto 50px 50px auto" }} />

            <h1 className="text-lg font-medium my-4 lg:ml-15 ml-10 ">Now Showing</h1>

            <div className="flex flex-wrap max-sm:justify-center max-md:justify-center justify-center gap-8">

              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))
              }
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 h-[90vh] flex flex-col items-center justify-center">
          <h2 className="text-[30px] font-semibold">No Movies Available</h2>
          <p className="text-lg text-gray-400">Please check back later.</p>
        </div >
      )}
    </>
  )
}

export default Movies