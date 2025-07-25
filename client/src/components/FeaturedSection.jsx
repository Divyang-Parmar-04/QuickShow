import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { dummyShowsData } from '../assets/assets'

function FeaturedSection() {
    const navigate = useNavigate()

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
            <div className="relative flex items-center justify-between pt-20 pb-10">
                <BlurCircle top='0px' right='-80px' />
                <p className="text-gray-300 font-medium text-lg">Now Showing</p>
                <button className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer" onClick={() => navigate('/')}>
                    View All
                    <ArrowRight />
                </button>
            </div>
            <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8 justify-center\\\">
               {dummyShowsData.slice(0, 4).map((show) => (
                   <MovieCard key={show.id} movie={show} />
               ))}
            </div>
            <div className="flex justify-center mt-20">
                <button onClick={()=>{navigate('/movies'),scrollTo(0,0)}} className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer">
                    Show more
                </button>
            </div>

        </div>

    )
}

export default FeaturedSection