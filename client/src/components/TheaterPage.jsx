import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

function useScreenWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function TheaterPage({ theaters, onUpdateTheater }) {
  const screenWidth = useScreenWidth();
  const [selectedTheater, setSelectedTheater] = useState(theaters[0]?._id);

  function handleOnTheaterClick(id, data) {
    setSelectedTheater(id)
    onUpdateTheater(data,id)
  }


  return (
    <div id="dateSelect" className="pt-4  ">
      <div className={`p-4 flex gap-3 relative rounded-[10px] ${screenWidth<640 && "overflow-auto flex-col h-40  flex-wrap" }`}>
        {theaters.map((theater, index) => (
          <div
          key={index}
          onClick={() => { handleOnTheaterClick(theater._id, theater.movies[0]) }}
          className={`flex p-2 pt-1 rounded-[10px] shadow-md border-3 transition-all cursor-pointer hover:shadow-lg w-70 h-40 text-white relative ${selectedTheater === theater?._id ? 'border-blue-500' : 'border-gray-200'
          } `}
          >
          <div className="absolute inset-0 bg-black/60 rounded-[8px] "></div>
            <div className="flex items-end">
              <div className=''>
                <img src={theater?.theater_images[0]} alt="" className='w-full h-full -z-10 absolute top-0 left-0 object-cover rounded-[8px]' />
                <h6 className="font-bold  text-white absolute bottom-18">{theater.theater_name}</h6>
                <p className="text-sm absolute bottom-2 h-[50px] overflow-x-auto w-[200px] no-scrollbar  ">{theater.address}</p>
              </div>
              {selectedTheater === theater._id && (
                <CheckIcon className="w-6 h-6 text-red-500 bg-black absolute top-2 right-2" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TheaterPage;