import { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import ReactPlayer from 'react-player';
import { PlayCircleIcon } from 'lucide-react';
import BlurCircle from './BlurCircle';

function TrailerSection() {
    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

    return (
        <div className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
            <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">Trailers</p>

            <div className="relative mt-6 aspect-video w-full max-w-[960px] mx-auto">
                <BlurCircle top='-100px' right='-100px' />
                <ReactPlayer
                    src={currentTrailer.videoUrl}
                    controls
                    width="100%"
                    height="100%"
                    className="react-player"
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
                {dummyTrailers.map((trailer, index) => (
                    <div
                        key={index}
                        className="relative hover:-translate-y-1 duration-300 transition cursor-pointer"
                        onClick={() => setCurrentTrailer(trailer)}
                    >
                        <img
                            alt="trailer"
                            className="rounded-lg w-full h-full object-cover brightness-75"
                            src={trailer.image}
                        />
                        <PlayCircleIcon
                            strokeWidth={1.6}
                            className="absolute top-1/2 left-1/2 w-6 md:w-8 h-6 md:h-8 transform -translate-x-1/2 -translate-y-1/2"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrailerSection;
