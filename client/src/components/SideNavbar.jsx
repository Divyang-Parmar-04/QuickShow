import React from "react";
import { Link } from "react-router-dom";
import { X, MapPin, Home, Film, Heart, LayoutDashboard } from "lucide-react";

function SideNavbar({ isOpen, setIsOpen, location, setIsLocationCardOpen }) {
    return (
        <>
            {/* Backdrop (mobile only) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Navbar */}
            <div
                className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex  flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70  md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-[280px] ' : 'max-md:w-0'}`}>

                {/* Close Button (mobile) */}
                <X
                className="md:hidden absolute top-5 right-5 w-6 h-6 text-white cursor-pointer"
                onClick={() => setIsOpen(false)}
            />
               <div className="flex flex-col md:flex-row gap-5">

                {/* Links */}
                <NavItem to="/" icon={<Home size={18} />} onClick={() => setIsOpen(false)}>
                    Home
                </NavItem>

                <NavItem to="/movies" icon={<Film size={18} />} onClick={() => setIsOpen(false)}>
                    Movies
                </NavItem>

                <NavItem to="/favorite" icon={<Heart size={18} />} onClick={() => setIsOpen(false)}>
                    Favorites
                </NavItem>

                <NavItem
                    to={import.meta.env.VITE_ADMIN_URL}
                    icon={<LayoutDashboard size={18} />}
                    onClick={() => setIsOpen(false)}
                >
                    Dashboard
                </NavItem>

            </div>

            {/* Location */}
            <button
                onClick={() => {
                    setIsLocationCardOpen(true);
                }}
                className="flex items-center gap-2 text-white  hover:text-blue-400 transition cursor-pointer"
            >
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-xl md:text-[16px] md:font-normal">
                    {location || "Select Location"}
                </span>
            </button>
        </div >
        </>
    );
}

export default SideNavbar;

/* Reusable Nav Item */
function NavItem({ to, icon, children, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="flex items-center gap-3
        w-full md:w-auto
        text-white md:text-[16px] md:font-normal
        font-medium text-xl
        hover:text-blue-400
        transition"
        >
            {icon}
            {children}
        </Link>
    );
}


