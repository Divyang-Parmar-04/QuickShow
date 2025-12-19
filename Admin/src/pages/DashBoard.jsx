import {
  ChartLine,
  CircleDollarSign,
  CirclePlay,
  Users,
  Star
} from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setOnStatusChange } from '../store/dataslice';

function DashBoard() {


  const admin = useSelector((admin) => admin.data.adminTheater);
  const currency = import.meta.env.VITE_CURRENCY || '₹';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

  const dispatch = useDispatch()

  const [dashBoardData, setDashBoardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUsers: 0
  });

  const [shows, setShows] = useState([])

  const [loading, setLoading] = useState(true);

  const dashBoardCards = [
    { title: 'Total Bookings', value: dashBoardData.totalBookings, icon: <ChartLine className="w-6 h-6" /> },
    { title: 'Total Revenue', value: `${currency} ${dashBoardData.totalRevenue}`, icon: <CircleDollarSign className="w-6 h-6" /> },
    { title: 'Active Shows', value: dashBoardData.activeShows?.length, icon: <CirclePlay className="w-6 h-6" /> },
    { title: 'Total Users', value: dashBoardData.totalUsers, icon: <Users className="w-6 h-6" /> },
  ];

  const fetchMoviesByIds = async (ids) => {
    const requests = ids.map(id =>
      axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`)
    );

    const responses = await Promise.all(requests);
    return responses.map(res => res.data);
  };


  const fetchDashBoardData = async () => {
    setLoading(true);

    try {
      const moviesIds = admin.theater?.movies.map((movie) => movie.movieId)
      // console.log(moviesIds)

      const shows = await fetchMoviesByIds(moviesIds)
      const showsPoster = shows.map(m => ({
        poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
        avg: m.vote_average
      }));


      console.log(showsPoster)
      setShows(showsPoster)

      setDashBoardData({
        totalBookings: admin.theater?.total_bookings,
        totalRevenue: admin.theater?.total_Revenue,
        activeShows: admin.theater?.movies || [],
        totalUsers: admin.theater?.total_user
      });
    } catch (error) {
      alert("somthing went wrong")
    }
    finally {
      setLoading(false);
    }
    // console.log(admin.theater)
  };

  useEffect(() => {
    if (!admin) return;
    fetchDashBoardData();
  }, [admin]);

  // ✅ Delete specific schedule by index
  const handleDeleteShowInstance = (theaterId, movieId, sIndex) => {

    const isDelete = confirm("Confrim DELETE")
    if (isDelete) {

      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/delete/show`, {
        tId: theaterId,
        mId: movieId,
        sIndex
      })
        .then((res) => {
          if (res.data.msg === true) {
            toast.success("Show deleted successfully");
            fetchDashBoardData(); // Refresh UI after delete
            dispatch(setOnStatusChange())

          } else {
            toast.error(res.data.msg || "Failed to delete show");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong");
        });
    }
  };


  return !loading ? (
    <>

      <h1 className='font-medium text-2xl'>Admin
        <span className='underline text-primary'> Dashboard</span>
      </h1>

      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle left='0px' top="-100px" />
        <div className="flex flex-wrap gap-4 w-full">
          {dashBoardCards.map((card, index) => (
            <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full" key={index}>
              <div>
                <h1 className="text-sm">{card.title}</h1>
                <p className="text-xl font-medium mt-1">{card.value}</p>
              </div>
              {card.icon}
            </div>
          ))}
        </div>
      </div>

      <p className='mt-10 text-lg font-medium'>Active Shows</p>
      <div className='flex flex-wrap gap-6 mt-4 max-w-5xl'>
        {(dashBoardData.activeShows || []).map((show, index) =>
          show?.schedules?.map((schedule, sIndex) => (
            <div
              className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300 relative"
              key={`${show._id}-${schedule.date}-${schedule.time}`}
            >

              <img
                alt={`${show.movie_name} Poster`}
                className="h-60 w-full object-contains"
                src={shows[index].poster || '/images/default_poster.jpg'}
              />

              <p className="font-medium p-2 truncate">{show.movie_name}</p>

              <div className="flex items-center justify-between px-2">
                <p className="text-lg font-medium">{currency}{show?.show_price || 'N/A'}</p>
                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  {shows[index].avg || 'N/A'}
                </p>
              </div>

              <p className="px-2 pt-2 text-sm text-gray-500">
                Date: {schedule.date} | Time: {schedule.time}
              </p>

              {/* ✅ Delete Button for specific show instance */}
              <button
                className="absolute cursor-pointer  top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                onClick={() =>
                  handleDeleteShowInstance(admin.theater._id, show.movieId, sIndex)
                }
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </>
  ) : (
    <Loader />
  );
}

export default DashBoard;
