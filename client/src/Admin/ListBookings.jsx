import { useEffect, useState } from "react"
import Loader from "../components/Loader"
import { dummyBookingData } from "../assets/assets"
import dateFormat from "../lib/dateFormat"

function ListBookings() {

  const currency = import.meta.env.VITE_CURRENCY

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setBookings(dummyBookingData)
    setLoading(false)
  })


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
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {bookings.map((booking) => (
              <tr className="border-b border-primary/10 bg-primary/5 even:bg-primary/10" key={booking._id}>
                <td className="p-2 min-w-45 pl-5">{booking.user.name}</td>
                <td className="p-2 min-w-45 pl-5">{booking.show.movie.title}</td>
                <td className="p-2">{dateFormat(booking.show.showDateTime)}</td>
                <td className="p-2">{booking.bookedSeats.join(' ,')}</td>
                <td className="p-2">{currency}{booking.amount}</td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loader />
  )
}

export default ListBookings