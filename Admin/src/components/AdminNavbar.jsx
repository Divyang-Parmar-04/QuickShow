import {Link, useNavigate} from 'react-router-dom'

function AdminNavbar() {
  const navigate = useNavigate()
  const isLogin = localStorage.getItem('ownerId')
  function handleLogOut(){
    localStorage.removeItem('ownerId')
    navigate(0)
  }
  return (
    <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30">
      <Link to = '/'>
        <img
          alt="logo"
          className="w-36 h-auto"
          src="/logo.svg"
          />
          </Link>
          {isLogin}{
            <Link onClick={handleLogOut} className='px-8 py-1 bg-red-500'>Logout</Link>
          }
    </div>
  )
}

export default AdminNavbar