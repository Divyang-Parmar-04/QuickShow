
import AdminNavbar from './components/AdminNavbar'
import AdminSideBar from './components/AdminSideBar'
import {useNavigate, NavLink} from "react-router-dom"
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
   const [isLogin, setIsLogin] = useState(localStorage.getItem('ownerId'))

   function handleOnClick() {
      localStorage.setItem('ownerId', id)
      setIsLogin("true")
      navigate('/admin')
   }

   useEffect(() => {
      if (ownerId != null) {
         axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movies/admin/${ownerId}`)
            .then((res) => {  
               dispatch(setAdminTheater(res.data))
            })
            .catch((err) => {
               console.log(err); 
               alert("Movie Fetch ERROR");
            });
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
                  <button className='p-0.5 rounded text-white bg-red-500 cursor-pointer px-8' onClick={handleOnClick}>Submit</button>
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