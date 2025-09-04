import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

function TheaterPage({ theaters, onUpdateTheater }) {
  const [selectedTheater, setSelectedTheater] = useState(theaters[0]?._id);

  function handleOnTheaterClick(id, data) {
    setSelectedTheater(id)
    onUpdateTheater(data,id)
  }


  return (
    <div id="dateSelect" className="pt-2">
      <div className="p-4 flex gap-3 relative  rounded-lg ">
        {theaters.map((theater, index) => (
          <div
          key={index}
          onClick={() => { handleOnTheaterClick(theater._id, theater.movies[0]) }}
          className={`flex p-2 rounded-lg shadow-md border transition-all cursor-pointer hover:shadow-lg w-55 h-30 text-white relative ${selectedTheater === theater?._id ? 'border-blue-300' : 'border-gray-200'
          } `}
          >
          <div className="absolute inset-0  bg-black/50"></div>
            <div className="flex items-end">
              <div className=''>
                <img src={theater?.theater_images[0]} alt="" className='w-full h-full -z-10 absolute top-0 left-0 object-cover rounded-lg' />
                <h6 className="font-semibold  text-white absolute bottom-18">{theater.theater_name}</h6>
                <p className="text-sm absolute bottom-2">{theater.address}</p>
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