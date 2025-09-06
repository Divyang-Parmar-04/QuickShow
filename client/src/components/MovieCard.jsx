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
        <div className={`relative flex flex-col justify-between bg-gray-900 text-white rounded-[10px] hover:-translate-y-2 transition duration-300 w-60 cursor-pointer`} onMouseOver={()=>setIsHover(true)} onMouseOut={()=>setIsHover(false)}>
            <img
                onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0) }}
                alt=""
                className="rounded-[10px] h-75 object-cover object-right-bottom cursor-pointer"
                src={movie.poster_path}
            />
            <p className="font-semibold mt-2 truncate mx-2">{movie.title}</p>
            <p className="text-sm text-gray-400 mt-2 mx-2">{new Date(movie.release_date).getFullYear()} • {movie.genres.slice(0, 2).map(genre => genre).join(' | ')} • {timeFormat(movie.runtime)}
            </p>
            <div className="flex items-center justify-between mt-4 pb-3 mx-2">
                <button className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer" onClick={() =>{navigate(`/movies/${movie._id}`); scrollTo(0, 0)}}>
                    Buy Tickets
                </button>
                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                   <StarIcon className="h-4 w-4 text-yellow-400 fill-primary" />
                    {movie.vote_average.toFixed(1)}
                </p>
            </div>
            {(fav) && (<button className={`absolute top-2 right-2 cursor-pointer`} onClick={()=>handleDeleteFavorite(movie._id)} id={movie._id}><XIcon className='bg-red-600'/></button>)}
        </div>
    )
}

export default MovieCard