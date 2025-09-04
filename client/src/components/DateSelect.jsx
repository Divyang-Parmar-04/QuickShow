import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import BlurCircle from './BlurCircle';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setShow } from '../store/dataslice'

function DateSelect({ movie, id , theaterId }) {
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    const [dateTime, setDateTime] = useState(null)

    // console.log(movie)
    const dispatch = useDispatch()

    function handleBookNow() {
        if (!selected) {
            return toast('Please select a date first');
        }

        const showTimings = movie.schedules
            .filter(s => s.date === selected)
            .map(s => s.time);

        dispatch(setShow({
            movieId: movie.movieId,
            movieName: movie.movie_name,
            theaterId:theaterId,
            date: selected,
            timing: showTimings,
        }));


        navigate(`/movies/${id}/${selected}`);
        scrollTo(0, 0);
    }


    return (
        <div id="dateSelect" className="pt-30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
                <BlurCircle top="-100px" left="-100px" />
                <BlurCircle bottom="-100px" right="-10px" />
                <div>
                    <p className="text-lg font-semibold">Choose Date</p>
                    <div className="flex items-center gap-6 text-sm mt-5">
                        <ChevronLeftIcon className="w-6 h-6" />
                        <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
                            {[...new Set(movie?.schedules?.map(s => s.date))].map((date) => (
                                <button
                                    key={date}
                                    className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer border border-primary/70 ${selected === date ? "bg-primary text-white" : "border border-primary/70"
                                        }`}
                                    onClick={() => setSelected(date)}
                                >
                                    <span>{new Date(date).getDate()}</span>
                                    <span>{new Date(date).toLocaleDateString("en-US", { month: "short" })}</span>
                                </button>
                            ))}
                        </span>
                        <ChevronRightIcon className="w-6 h-6" />
                    </div>
                </div>
                <button className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer" onClick={handleBookNow}>Book Now</button>
            </div>
        </div>
    )
}

export default DateSelect 