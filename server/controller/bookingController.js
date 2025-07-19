
const BOOKING = require('../models/movieBooking')
const THEATER = require('../models/theaterModel')


// Fucnton to check availability of selected seates for a movie

const checkSeatsAvailabilty = async (theaterId, showId, selectedSeats) => {
    try {
        const theater = await THEATER.findById(theaterId)
        if (!theater) return false

        const show = theater.movies.filter((mov) => mov.movieId == movieId)

        if (!show) return false;

        const occupiedSeats = show.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat])

        return !isAnySeatTaken;

    } catch (error) {
        console.log(error.message);
        return false
    }
}

const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { theaterId, showId, selectedSeats } = req.body;

        const isAvialable = await checkSeatsAvailabilty(theaterId, showId, selectedSeats)

        if (!isAvialable) {
            return res.json({ res: false, msg: "Selected Seat is Not Available" })
        }

        //GET SHOW DETAILS 
        const theater = await THEATER.findById(theaterId)

        const show = theater.movies.filter((mov) => mov.movieId == movieId)

        const booking = await BOOKING.create({
            user: userId,
            show: showId,
            theater: theaterId,
            amount: show.show_price * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat) => {
            show.occupiedSeats[seat] = userId;
        })

        show.markModified('occupiedSeats')

        await theater.save()

        return res.json({ res: true, msg: "Booked Successfully" })

    } catch (error) {
        console.log(error)
        return res.json({ msg: "ERROR" })
    }
}

const getOccupiedSeats = async (req, res) => {
    try {
        const { theaterId, showId } = req.body
        
        const theater = await THEATER.findById(theaterId)
        const show = theater.movies.filter((mov) => mov.movieId == movieId)

        const occupiedSeat = Object.keys(show.occupiedSeat)

        return res.json({res:true,data:occupiedSeat})

    } catch (error) {
        console.log(error)
        return res.json({ msg: "ERROR" })
    }
}


module.exports = {getOccupiedSeats,createBooking,checkSeatsAvailabilty}