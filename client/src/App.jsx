import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import {Toaster} from 'react-hot-toast'

function App() {

  return (
    <>
      <Toaster/>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
