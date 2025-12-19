import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SkeletonCard() {
  return (
    <SkeletonTheme baseColor="#1f2937" highlightColor="#4444">
      <div className="relative flex flex-col justify-between bg-gray-950 w-60 rounded-2xl px-1">

        {/* Poster */}
        <div className="rounded-t-2xl w-full">
        <Skeleton
          height={280}
          borderRadius={10}
          className=" w-full z-10"
          />
          </div>
        {/* Title */}
        <div className="mt-3 mx-2 px-1">
          <Skeleton height={16} width="85%" />
        </div>

        {/* Meta Info */}
        <div className="mt-2 mx-2 px-1">
          <Skeleton height={12} width="70%" />
        </div>

        {/* Footer */}
        <div className="flex items-center mx-2 justify-between mt-4 px-1 pb-2">
          <Skeleton height={32} width={90} borderRadius={999} />
          <Skeleton height={14} width={40} />
        </div>

      </div>
    </SkeletonTheme>
  );
}

export default SkeletonCard;
