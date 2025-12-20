import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

function SeatLayout() {

  const tdata = useSelector((data) => data.data.show)
  const { user } = useUser()
  // console.log(tdata.timing)

  const groupRows = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I', 'J']];

  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const navigate = useNavigate()

  function handleSeatClick(seatId) {
    if (!selectedTime) {
      return toast("Please select time first")
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast("You can only select up to 5 seats")
    }
    setSelectedSeats((prev) => prev.includes(seatId) ? prev.filter((seat) => seat !== seatId) : [...prev, seatId]);
  }

  async function fetchOccupiedSeats(theaterId, movieId, date, time) {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/theater/${theaterId}/movie/${movieId}/occupied-seats`, {
        params: { date, time }
      });
      return res.data.occupiedSeats || [];
    } catch (error) {
      console.error("Failed to fetch occupied seats", error);
      return [];
    }
  }

  // Update your seat rendering to disable occupied seats
  const renderSeats = (row, count = 9) => (
    <div className="flex gap-2 mt-2" key={row}>
      <div className="flex flx-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isOccupied = occupiedSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);

          return (
            <button
              key={seatId}
              disabled={isOccupied}
              onClick={() => !isOccupied && handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer
                ${isSelected ? "bg-primary text-white" : ""}
                ${isOccupied ? "bg-gray-400 cursor-not-allowed" : ""}
              `}
              title={isOccupied ? "Seat already booked" : seatId}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );


  function handleMyBooking() {
    if (tdata &&  user) {
      const booking = {
        email: user?.emailAddresses[0].emailAddress,
        theaterId: tdata?.theaterId,
        showId: tdata?.movieId,
        selectedSeats: selectedSeats,
        showDateTime: `${tdata.date} ${selectedTime}`
      }
      // console.log(booking)
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/movie/newbooking`, booking)
        .then((res) => {
          if (res.data.book) {
            // console.log(res.data.url)
            window.location.href = res.data.url
            setSelectedSeats([])
            setSelectedTime(null)
          }
        })
        .catch((err) => {
          toast.error("Somthing went wrong")
        })
    }
    else{toast("Please Login",{icon:"😊"})}
  }

  useEffect(() => {
    if (tdata) {
      setShow({ dateTime: tdata })
    }
  }, [id, tdata])

  useEffect(() => {
    if (selectedTime && tdata) {
      const date = tdata.date;
      const theaterId = tdata.theaterId;
      const movieId = tdata.movieId;

      fetchOccupiedSeats(theaterId, movieId, date, selectedTime)
        .then(seats => {
          setOccupiedSeats(seats);
          // Clear selected seats if any selected seat is now occupied
          setSelectedSeats(prev => prev.filter(seat => !seats.includes(seat)));
        })
        .catch(() => toast.error("Failed to load occupied seats"));
    }
  }, [selectedTime, tdata]);


  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* Available Timing */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.dateTime.timing.map((item) => (
            <div className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime === item ? "bg-primary text-white" : "hover:bg-primary/20"}`}

              onClick={() => setSelectedTime(item)} key={item}>
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        {/* Background Blur Effects */}

        <BlurCircle top="100px" left="-100px" />
        <BlurCircle top="0" right="0" />

        {/* Screen Label */}
        <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>
        <img
          alt="screen"
          src='/assets/screenImage.svg'
        />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        {/* Seats */}
        <div className="w-100 md:w-200 lg:w-200 overflow-auto lg:flex lg:justify-center ">
          <div className="flex flex-col items-center mt-10 text-xs text-gray-300 w-180 p-4 ">
            <div className="grid grid-cols-1 gap-2 mb-6 ">
              {groupRows[0].map(row => renderSeats(row))}
            </div>
            <div className="grid grid-cols-2 gap-11">
              {groupRows.slice(1).map((group, index) => (
                <div className="flex flex-col items-center" key={index}>
                  {group.map(row => renderSeats(row))}
                </div>)
              )}
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95" onClick={handleMyBooking}>
          Proceed to Checkout
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loader />
  )
}

export default SeatLayout