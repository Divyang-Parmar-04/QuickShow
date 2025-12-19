import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


function SkelitonCard({ index }) {
    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <div className="max-w-[160px] cursor-pointer transition duration-300">
                <div className="h-[240px] w-[160px] rounded-lg overflow-hidden">
                    <Skeleton height="100%" />
                </div>
            </div>
        </SkeletonTheme>

    )
}

export default SkelitonCard