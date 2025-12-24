import { Cross, DeleteIcon, StarIcon, XIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function MovieCard({ movie,fav=false }) {
    const navigate = useNavigate()
    const [isHover,setIsHover] = useState(false)
    const {user} = useUser()
    

    function handleDeleteFavorite(id){
       if(user){
           console.log(user?.id ,id)
           axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/movie/favorite/delete`,{userId:user?.id,movieId:id})
          .then((res)=>{
            if(res.data.msg=='error')toast.error("Somthing went Wrong")
            else if(res.data.msg)toast.success("Movie Remove From Favorite List")
            else toast.error("No MovieFind")    
          })
          .catch((err)=>{
            toast.error("Somthing went wrong")
          })
       }
    }

    return (
        <div className={`relative flex flex-col justify-between md:bg-gray-900 text-white rounded-[10px] hover:-translate-y-2 transition duration-300 w-40 md:w-60 cursor-pointer`} onMouseOver={()=>setIsHover(true)} onMouseOut={()=>setIsHover(false)}>
            <img
                onClick={() => { navigate(`/movies/${movie.id}`); scrollTo(0, 0) }}
                alt=""
                className="rounded-[10px] md:rounded-tl-[10px] md:rounded-tr-[10px] lg:rounded-b-none md:h-75 h-60 object-contains object-right-bottom cursor-pointer"
                src={"https://image.tmdb.org/t/p/w780"+movie.poster_path}
            />
            <div className=''>
            <p className="font-semibold mt-2 truncate mx-2">{movie.title}</p>
            <p className="hidden md:block text-sm text-gray-400 mt-2 mx-2">{new Date(movie.release_date).getFullYear()} • {movie.genres.slice(0, 2).map(genre => genre.name).join(' | ')} • {timeFormat(movie.runtime)}
            </p>
            <div className="flex items-center justify-between md:mt-4 mt-1 md:pb-3 mx-2">
                <button className="hidden md:block lg:px-4 lg:py-2 px-2 py-1 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer" onClick={() =>{navigate(`/movies/${movie.id}`); scrollTo(0, 0)}}>
                    Buy Tickets
                </button>
                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                   <StarIcon className="h-4 w-4 text-yellow-400 fill-primary" />
                    {movie.vote_average.toFixed(1)}
                </p>
            </div>
            </div>
            {(fav) && (<button className={`absolute top-2 right-2 cursor-pointer`} onClick={()=>handleDeleteFavorite(movie.id)} id={movie.id}><XIcon className='bg-red-600'/></button>)}
        </div>
    )
}

export default MovieCard