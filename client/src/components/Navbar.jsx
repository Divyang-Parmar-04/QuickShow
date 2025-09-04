import { Link, useNavigate } from 'react-router-dom'
import { MapPin, MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useDispatch } from 'react-redux'
import {setlocation} from '../store/dataslice'
import axios from 'axios'
import toast from 'react-hot-toast'

function Navbar() {
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const [isLocationCardOpen, setIsLocationCardOpen] = useState(false)
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const navigate = useNavigate()
  const [location, setLocation] = useState('')

  // console.log(user?.emailAddresses[0].emailAddress)

  // Predefined list of locations
  const locations = ['Ahmedabad','Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Kolkata', 'Chennai']

  useEffect(() => {
    const storedLocation = localStorage.getItem('location')
    if (storedLocation) {
      setLocation(storedLocation)
    } else {
      // Show location card if no location is set, but not on homepage
      if (window.location.pathname == '/') {
        setIsLocationCardOpen(true)
      }
    }
  }, [])
  // console.log(user?.emailAddresses[0].emailAddress)

  // Handle location selection
  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation)
    localStorage.setItem('location', selectedLocation)
    dispatch(setlocation(selectedLocation))
    setIsLocationCardOpen(false)
  }

  //Create new User
  const createNewUser=()=>{
    if(user){
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/create/newUser`,{fullName:user?.fullName,email:user?.emailAddresses[0].emailAddress,id:user?.id,imageUrl:user?.imageUrl})
      .then((res)=>{
        if(res.data.msg=='error'){
        return toast("Somthing went wrong",{icon:"❌"})
        }
        else if(res.data.msg=='exists'){
          return
        }
        else{
         return toast("Login Succsessfull",{icon:"✅"})
        }
      })
      .catch((err)=>{
        console.log(err)
        toast("Somthing went wrong",{icon:"❌"})
      })
    }
  }

  useEffect(()=>{
    if(user){
      createNewUser()
    }
  },[user])

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 ">
      <Link to="/" className="max-md:flex-1">
        <img src="/assets/logo.svg" alt="" className="w-35 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? 'max-md:w-full ' : 'max-md:w-0'
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">
          Home
        </Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/movies">
          Movies
        </Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/favorite">
          Favorites
        </Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/admin">
          DashBoard
        </Link>
        <button
          className="flex gap-1 items-center cursor-pointer"
          onClick={() => setIsLocationCardOpen(true)}
        >
          <MapPin className="invert w-5" />
          {location || 'Select Location'}
        </button>
      </div>

      {/* Location Card Pop-up */}
      {isLocationCardOpen && (
        <div className="fixed top-0 left-0 w-full inset-0 z-60 bg-black/50 flex justify-center">
          <div
            className="bg-white text-black rounded-lg shadow-lg lg:w-[800px] lg:h-[150px] w-[380px] h-[150px] md:w-[500px] mt-16 p-6 transform transition-all duration-300 ease-in-out translate-y-0 opacity-100 "
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select Your Location</h2>
              <XIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() => setIsLocationCardOpen(false)}
              />
            </div>
            <div className="flex overflow-auto">
              {locations.map((loc) => (
                <button
                  key={loc}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => handleLocationSelect(loc)}
                >
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span>{loc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-8">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
        {!user ? (
          <button
            className="px-4 py-1 sm:px-7 sm:py-3 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
            onClick={()=>{
              openSignIn,
              createNewUser
            }}
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate('my-bookings')}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  )
}

export default Navbar