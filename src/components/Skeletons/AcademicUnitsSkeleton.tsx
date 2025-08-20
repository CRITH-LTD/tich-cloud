import React from 'react';
import ShimmerLoader from '../Common/ShimmerLoader ';

interface AcademicUnitsSkeletonProps {
  count?: number;
}

const AcademicUnitsSkeleton: React.FC<AcademicUnitsSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Icon placeholder */}
              <ShimmerLoader width={32} height={32} borderRadius={8} />
              
              <div className="min-w-0 flex-1 space-y-2">
                {/* Title placeholder */}
                <ShimmerLoader width={192} height={16} borderRadius={4} />
                {/* Subtitle placeholder */}
                <ShimmerLoader width={128} height={12} borderRadius={4} />
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <ShimmerLoader width={32} height={32} borderRadius={8} />
              <ShimmerLoader width={32} height={32} borderRadius={8} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AcademicUnitsSkeleton;
