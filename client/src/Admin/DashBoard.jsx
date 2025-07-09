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
import { dummyDashboardData } from '../assets/assets';
import dateFormat from '../lib/dateFormat';


function DashBoard() {

    const currency = import.meta.env.VITE_CURRENCY || '₹';

    const [dashBoardData, setDashBoardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUsers: 0
    })
    const [loading, setLoading] = useState(true);

    const dashBoardCards = [
        { title: 'Total Bookings', value: dashBoardData.totalBookings, icon: <ChartLine className="w-6 h-6" /> },
        { title: 'Total Revenue', value: `${currency} ${dashBoardData.totalRevenue}`, icon: <CircleDollarSign className="w-6 h-6" /> },
        { title: 'Active Shows', value: dashBoardData.activeShows.length, icon: <CirclePlay className="w-6 h-6" /> },
        { title: 'Total Users', value: dashBoardData.totalUsers, icon: <Users className="w-6 h-6" /> },
    ]

    function fetchDashBoardData() {
        setLoading(true);
        setDashBoardData({
            totalBookings: dummyDashboardData.totalBookings,
            totalRevenue: dummyDashboardData.totalRevenue,
            activeShows: dummyDashboardData.activeShows,
            totalUsers: dummyDashboardData.totalUser
        })
    }

    useEffect(() => {
        fetchDashBoardData();
        setLoading(false);
    }, [])

    return !loading ? (
        <>
            <h1 className='font-medium text-2xl'>Admin
                <span className='underline text-primary'> Dashboard</span>
            </h1>
            <div className="relative flex flex-wrap gap-4 mt-6">
                {/* Background glow circle */}
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
                {dashBoardData.activeShows.map((show) => (
                    <div className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300" key={show._id}>
                        <img
                            alt="Sinners Poster"
                            className="h-60 w-full object-cover"
                            src={show.movie.backdrop_path}
                        />

                        <p className="font-medium p-2 truncate">{show.movie.title}</p>

                        <div className="flex items-center justify-between px-2">
                            <p className="text-lg font-medium">{currency}{show.showPrice}</p>
                            <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                                {show.movie.vote_average.toFixed(1)}
                            </p>
                        </div>

                        <p className="px-2 pt-2 text-sm text-gray-500">
                            {/* Sun, June 7 at 8:51 PM */}
                            {dateFormat(show.showDateTime)}
                        </p>
                    </div>
                ))}
            </div>
        </>
    ) : (
        <Loader />
    )
}

export default DashBoard