import { useEffect, useState } from "react"
import Loader from "../components/Loader"
import { useSelector } from 'react-redux'

function ListShows() {

  const currency = import.meta.env.VITE_CURRENCY
  const admin = useSelector((admin) => admin.data.adminTheater);

  const [shows, setShows] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInfo, setShowInfo] = useState([])

  useEffect(() => {

    if (shows == null) {

      setShows(admin?.theater)

      admin?.theater.movies.map((mov) => {
        const showBooking = admin?.bookings.filter((bok) => mov.movieId._id === bok.show._id)
        let booking = 0;
        let Earnings = 0;
        showBooking.map((book) => {
          booking += book.bookedSeats.length
          Earnings += book.amount
        })

        const show = {
          id: showBooking[0]?.show._id,
          bookings: booking,
          Earnings: Earnings
        }
  
      
        setShowInfo((prev) => [...prev, { show }])
      })
      setLoading(false)

    }
  }, [admin])


  return !loading ? (
    <>
      <h1 className='font-medium text-2xl'>List
        <span className='underline text-primary'> Shows
        </span>
      </h1>
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {shows?.movies?.map((movie, index) => {

              const showinfo = showInfo.filter((show) => {
                show.show.id == movie.movieId._id
              })

              // console.log(showInfo)

              const totalBookings = showInfo[index]?.show.bookings
              const totalEarnings = showInfo[index]?.show.Earnings

              return (
                <tr
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
                  key={index}
                >
                  <td className="p-2 min-w-45 pl-5">{movie.movie_name}</td>

                  {/* ✅ Each schedule in a new line */}
                  <td className="p-2 whitespace-pre-line">
                    {(movie.schedules || []).map((s, i) => `${s.date} @ ${s.time}`).join('\n') || 'No Shows'}
                  </td>

                  <td className="p-2">{totalBookings}</td>
                  <td className="p-2">{currency}{totalEarnings}</td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </>
  ) : (
    <Loader />
  )
}

export default ListShows