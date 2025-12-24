import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const TrailerSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#1f2937" highlightColor="#4444">
      <div className="mt-6">
        {/* Video Player Skeleton */}
        <div className="w-full max-w-[960px] mx-auto">
          <Skeleton
            height="100%"
            className="aspect-video rounded-2xl"
          />
        </div>
      </div>
    </SkeletonTheme>
  )
}

export default TrailerSkeleton
