import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { PlayCircleIcon } from 'lucide-react';
import BlurCircle from './BlurCircle';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import TrailerSkeleton from './TrailerSkeleton';

function TrailerSection() {


    const [currentTrailer, setCurrentTrailer] = useState(0);
    const [movieTrailler, setMoviesTrailler] = useState(null)

    const movies = useSelector((state) => state.data)

    useEffect(() => {

        const trailer = movies?.movieData.map((mov) => {
            return mov.videos?.results?.find((vid) => vid.type === "Trailer" && vid.site === "YouTube");
        })
        const moviesInfo = movies.movieData?.map((mov) => ({ title: mov.title, img: mov.backdrop_path }))

        setMoviesTrailler({ moviesInfo: moviesInfo, trailer: trailer })

    }, [movies])

    return (
    <div className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
        <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">Trailers</p>

        {movieTrailler?.moviesInfo.length > 0 ? (
            <>
                <div className="relative mt-6 aspect-video w-full max-w-[960px] mx-auto rounded-2xl ">
                    <BlurCircle top='-100px' right='-100px' />
                    <ReactPlayer
                        src={`https://www.youtube.com/embed/${movieTrailler?.trailer[currentTrailer]?.key}`}
                        controls
                        width="100%"
                        height="100%"
                        className="react-player "
                    />
                </div>

                <div className="flex flex-wrap justify-center overflow-x-auto gap-3 md:gap-8 mt-8 px-2 max-w-4xl h-22 md:h-32 md:py-2 mx-auto scrollbar-hide ">
                    {Array(movieTrailler?.moviesInfo.length).fill(0).map((trailer, index) => (
                        <div
                            key={index}
                            className="relative hover:-translate-y-1 duration-300 transition cursor-pointer w-36 md:w-45 "
                            onClick={() => setCurrentTrailer(index)}
                        >
                            <img
                                alt="trailer"
                                className="rounded-lg w-full h-full object-cover brightness-75"
                                src={"https://image.tmdb.org/t/p/w500" + movieTrailler?.moviesInfo[index]?.img}
                            />
                            <PlayCircleIcon
                                strokeWidth={1.6}
                                className="absolute top-1/2 left-1/2 w-6 md:w-8 h-6 md:h-8 transform -translate-x-1/2 -translate-y-1/2"
                            />

                        </div>
                    ))}
                </div>
            </>
        ) : (<TrailerSkeleton />)}
    </div>
)

}

export default TrailerSection;
