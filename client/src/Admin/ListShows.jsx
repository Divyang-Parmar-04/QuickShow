import { useEffect, useState } from "react"
import Loader from "../components/Loader"
import { dummyDashboardData } from "../assets/assets"
import dateFormat from "../lib/dateFormat"

function ListShows() {

  const currency = import.meta.env.VITE_CURRENCY

  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setShows(dummyDashboardData.activeShows)
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
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {shows.map((show,index) => (
              <tr className="border-b border-primary/10 bg-primary/5 even:bg-primary/10" key={index}>
                <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
                <td className="p-2">{dateFormat(show.showDateTime)}</td>
                <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                <td className="p-2">{currency}{Object.keys(show.occupiedSeats).length*show.showPrice}</td>
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

export default ListShows