const BOOKING = require("../models/movieBooking")

//API Controller Function to get User Bookings

const getUserBookings = async (req,res)=>{
    try {
        const user = req.auth().userId;
        const bookings = await BOOKING.find({user}).populate({
            path:""
        })
    } catch (error) {
      console.log(error)
      return res.json({success:false,meg:"error"})
    }
}