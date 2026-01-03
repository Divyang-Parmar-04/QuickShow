import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import { useUser } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import ETicket from "../components/ETiket";


const MyBookings = () => {

  const currency = import.meta.env.VITE_CURRENCY || '$';
  const movies = useSelector((state) => state.data.movieData)
  const theater = useSelector((state) => state.data.TheaterData)
  const [movieID, setMovieID] = useState(0)

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTiketView, setIsTiketView] = useState(false)

  const [lang,setLang] = useState('')
  const [format,setFormat] = useState('')

  const [bookShows, setBookShows] = useState([])

  const { user } = useUser()

  function handleGetBookingData(index) {
    setIsTiketView(true),
    setMovieID(index)
    
    const th = theater.find((th)=>th._id==bookings[index].theater)

    const show = th.movies.find((mov)=>mov.movieId==bookShows[movieID].id)
  
    const schedules = show.schedules.find((sc)=>sc.time==bookings[movieID].showDateTime.split(" ")[1] +" "+bookings[movieID].showDateTime.split(" ")[2])

    setLang(schedules.languages)
    setFormat(schedules.format)

  }

  useEffect(() => {


    const fetchBookingsAndCheckPayment = async () => {
      try {
        if (!user) return;

        const email = user?.emailAddresses[0].emailAddress;

        // 1. Fetch all bookings
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movie/mybookings/${email}`);
        if (res.data.msg === 'error') {
          toast("Something went wrong while fetching bookings", { icon: "❌" });
          return;
        }

        let updatedBookings = res.data.bookings;

        // 2. Check each unpaid booking if payment is completed
        const checkPayments = await Promise.all(
          updatedBookings.map(async (booking) => {
            if (!booking.isPaid && booking.sessionId) {
              try {
                const statusRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/payment-status/${booking.sessionId}`);
                if (statusRes.data.updated) {
                  return { ...booking, isPaid: true }; // update locally
                }
              } catch (err) {
                console.error("Payment check error:", err);
              }
            }
            return booking;
          })
        );

        // console.log(checkPayments[0])

        const shows = checkPayments.map((show) => {
          // console.log(show)
          return movies.find((mov) => mov.id == show.show)
        })

        setBookShows(shows)
        // console.log(shows[0])

        setBookings(checkPayments);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast("Something went wrong", { icon: "❌" });
        setLoading(false);
      }
    };

    fetchBookingsAndCheckPayment();

  }, [user, movies]);




  return !loading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh] mb-30">
      <BlurCircle top="100px" left="100px" />
      <div>
        {/* <BlurCircle bottom="0px" left="600px" className="pl-2"/> */}
      </div>
      <h1 className="text-lg font-semibold mb-4">My Bookings</h1>


      {/* Booking Card */}

      {isTiketView && (
        <div className="inset-0 fixed backdrop-blur-xl z-50 flex justify-center items-center ">
          <ETicket
            booking={{
              movie: `${bookShows[movieID]?.title}`,
              language: `${lang}`,
              format: `${format}`,
              date: `${bookings[movieID].showDateTime.split(" ")[0]} | ${bookings[movieID].showDateTime.split(" ")[1]} ${bookings[movieID].showDateTime.split(" ")[2]} `,
              theater: `${(theater.find((th) => th._id == bookings[movieID]?.theater).theater_name)}`,
              screen: "SCREEN 1",
              seat: `${bookings[movieID].bookedSeats.join(", ")}`,
              bookingId: `${bookings[movieID]?._id}`,
              poster: `https://image.tmdb.org/t/p/w500${bookShows[movieID]?.poster_path}`,
              price: `${bookings[movieID]?.amount - 10}`,
              fee: 10,
              totalT: `${bookings[movieID].bookedSeats.length}`,
              total: `${bookings[movieID]?.amount}`,
              onHandleCloseTiketView: () => { setIsTiketView(false) }
            }}
          />
        </div>
      )}

      {bookings.length > 0 ? bookings.map((booking, index) => (
        <div key={index} className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl relative">
          <div className="flex flex-col md:flex-row">
            <img
              alt=""
              className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
              src={"https://image.tmdb.org/t/p/w500" + bookShows[index]?.backdrop_path}
            />
            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">{bookShows[index]?.title}</p>
              <p className="text-gray-400 text-sm">{timeFormat(bookShows[index]?.runtime)}</p>
              <p className="text-gray-400 text-sm mt-auto">Date : {booking.showDateTime.split(" ")[0]} <br />Time : {booking.showDateTime.split(" ")[1]} {booking.showDateTime.split(" ")[2]}</p>
            </div>
          </div>
          <div className="flex items-center">
            {booking.isPaid && (
              <button
                className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer absolute lg:top-15 lg:left-100 md:left-100 md:top-15 top-80 left-50" onClick={() => { handleGetBookingData(index) }}>View Tiket
              </button>
            )}
          </div>
          <div className="flex flex-col md:items-end md:text-right justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold mb-3">{currency}{booking.amount}</p>
              {!booking.isPaid && (
                <button
                  className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer" ><Link to={booking.paymentLink}>Pay Now</Link>
                </button>
              )}
            </div>
            <div className="text-sm">
              <p>
                <span className="text-gray-400">Total Tickets:</span> {booking.bookedSeats.length}
              </p>
              <p>
                <span className="text-gray-400">Seat Number:</span> {booking.bookedSeats.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )) : (
        <div className="flex justify-center items-center h-80">
          <h1 className="text-[30px]">You Don't Have Any BOOKING'S </h1>
        </div>
      )}


    </div>
  ) : (
    <Loader />
  )
};

export default MyBookings;
