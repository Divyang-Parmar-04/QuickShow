import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import Loader from './Loader'
import SkeletonCard from "./SkeletonCard"

function FeaturedSection() {
    const navigate = useNavigate()
    const data = useSelector((data) => data.data.movieData);
    // console.log(data)
    const [movies, setMovies] = useState([])

    useEffect(() => {
        setMovies(data)
    }, [data])

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
            <div className="relative flex items-center justify-between pt-20 pb-10">
                <BlurCircle top='0px' right='-80px' />
                <p className="text-gray-300 font-medium text-lg">Now Showing</p>
                <button className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer" onClick={() => navigate('/movies')}>
                    View All
                    <ArrowRight />
                </button>
            </div>
            <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8 justify-center">

                {movies.length > 0 ? (
                    movies.slice(0, 4).map((show) => (
                        <MovieCard key={show.id} movie={show} />
                    ))
                ) : (
                    Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))
                )}

            </div>
            <div className="flex justify-center mt-20">
                {movies.length > 0 ? (
                    <button onClick={() => { navigate('/movies'), scrollTo(0, 0) }} className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer">
                        Show more
                    </button>
                ) : null}

            </div>

        </div>

    )
}

export default FeaturedSection