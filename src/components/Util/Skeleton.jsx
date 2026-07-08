/** Pulsing gray placeholders shaped like the content they stand in for. */
export const SkeletonBlock = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

export const SkeletonPage = ({ rows = 6 }) => (
  <div className="px-2 py-3 space-y-3">
    <SkeletonBlock className="w-1/2 h-6" />
    <SkeletonBlock className="h-32" />
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonBlock key={i} className="h-10" />
    ))}
  </div>
);
