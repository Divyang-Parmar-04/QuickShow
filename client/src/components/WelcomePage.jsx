import { useNavigate } from "react-router-dom";


function WelcomePage() {

    const navigate = useNavigate()
    return (
            <div className="relative flex flex-col items-start justify-center gap-6 px-6 md:px-16 lg:px-36 h-screen bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba)"
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/70"></div>

                {/* Logo / Brand */}
                <h1 className="text-5xl md:text-[70px] font-bold text-white z-20">
                    Welcome to <span className="text-primary">QuickShow</span>
                </h1>

                {/* Tagline */}
                <p className="text-lg md:text-xl text-gray-200 max-w-xl z-20">
                    Your one-stop destination to discover movies, explore showtimes, and book tickets instantly.
                    Experience cinema like never before.
                </p>

                {/* Feature Highlights */}
                <div className="flex flex-wrap gap-4 text-white z-20">
                    <span className="px-4 py-2 bg-white/10 rounded-full">
                        🎬 Latest Movies
                    </span>
                    <span className="px-4 py-2 bg-white/10 rounded-full">
                        🏢 Nearby Theaters
                    </span>
                    <span className="px-4 py-2 bg-white/10 rounded-full">
                        💺 Easy Seat Booking
                    </span>
                    <span className="px-4 py-2 bg-white/10 rounded-full">
                        ⚡ Fast & Secure
                    </span>
                </div>

                {/* CTA Button */}
                <button
                    className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dull transition rounded-full font-medium z-20"
                    onClick={() => navigate("/movies")}
                >
                    Explore Movies
                </button>
            </div>
        );
}

export default WelcomePage