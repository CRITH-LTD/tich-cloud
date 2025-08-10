import ShimmerLoader from "../../../../../components/Common/ShimmerLoader ";

const DepartmentRowSkeleton: React.FC = () => (
  <div className="border border-gray-200 rounded-lg p-4 bg-white">
    <div className="flex items-center space-x-3">
      {/* icon placeholder */}
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
        <ShimmerLoader width={16} height={16} borderRadius={4} />
      </div>

      {/* text placeholders */}
      <div className="flex-1 min-w-0 space-y-2">
        <ShimmerLoader width="40%" height={16} />
        <ShimmerLoader width="60%" height={12} />
      </div>

      {/* action buttons */}
      <div className="flex items-center space-x-2 ml-4">
        <ShimmerLoader width={32} height={32} borderRadius={6} />
        <ShimmerLoader width={32} height={32} borderRadius={6} />
      </div>
    </div>
  </div>
);

const DepartmentsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <DepartmentRowSkeleton key={i} />
    ))}
  </div>
);

export default DepartmentsSkeleton;