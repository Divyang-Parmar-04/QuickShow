import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

function Loader() {
   
  const {nextUrl} = useParams()
  const navigate = useNavigate()

  useEffect(()=>{
    if(nextUrl){
      setTimeout(()=>{
        navigate("/"+nextUrl)
      },8000)
    }
  },[])

  return (
    <div className='flex justify-center items-center h-[80vh]'>
        <div className='loader'></div>
    </div>
  )
}

export default Loader