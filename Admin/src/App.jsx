
import AdminNavbar from './components/AdminNavbar'
import AdminSideBar from './components/AdminSideBar'
import { useNavigate, NavLink } from "react-router-dom"
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setAdminTheater } from './store/dataslice'
import { Toaster } from 'react-hot-toast'

function App() {

   const ownerId = localStorage.getItem('ownerId')
   const navigate = useNavigate()

   const dispatch = useDispatch()
   const [id, setId] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [isLogin, setIsLogin] = useState(false)

   function handleOnClick() {
      if (id.length < 24) return alert("Please Enter Valid ID Number")
      setIsLoading(true)
      localStorage.setItem('ownerId', id)
   }

   useEffect(() => {
      if (ownerId != null) {

         axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movies/admin/${ownerId}`, {
            headers: {
               "ngrok-skip-browser-warning": "true",
            },
         })
            .then((res) => {


               if (res.data.movies == 'error' || res.data.theater == null) return alert("NO Admin found on this ID")
               dispatch(setAdminTheater(res.data))
               setIsLogin(true)
               navigate("/admin")
            })
            .catch((err) => {
               console.log(err);
               alert("Movie Fetch ERROR");
            })
            .finally(() => setIsLoading(false))
      }
   }, [ownerId])
   return (
      <>
         <Toaster />
         <AdminNavbar />
         {!isLogin && (
            <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md'>
               <div className='w-95 h-60 bg-white rounded-2xl flex flex-col items-center text-black justify-center gap-4'>
                  <h2 className='text-2xl'>Login</h2>
                  <input type='text' placeholder='Enter ownerId' className='px-4 py-1 border-2  border-b-gray-800' value={id} onChange={(e) => setId(e.target.value)} />
                  <button className='p-0.5 rounded text-white bg-red-500 cursor-pointer px-8' onClick={handleOnClick}>{!isLoading ? "Submit" : (<div className="flex items-center justify-center">
                     <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
                  </div>
                  )}</button>
                  <NavLink className="text-blue-600 underline" to={import.meta.env.VITE_CLIENT_URL}>Go to Main Website </NavLink>
               </div>
            </div>
         )}

         <div className="flex">
            <AdminSideBar />
            <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
               <Outlet />
            </div>
         </div>
      </>
   )
}

export default App