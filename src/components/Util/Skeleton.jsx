/** Pulsing gray placeholders shaped like the content they stand in for. */
export const SkeletonBlock = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

/** Mirrors the Brolympics page chrome: centered title, ring-strip slot,
 * then content cards -- the parts every status shares. */
export const SkeletonBroPage = () => (
  <div className="px-4 py-4 space-y-3">
    <div className="flex flex-col items-center gap-2 py-2">
      <SkeletonBlock className="w-48 h-8" />
      <SkeletonBlock className="w-24 h-3" />
      <SkeletonBlock className="w-24 h-1" />
    </div>
    <SkeletonBlock className="h-32" />
    <SkeletonBlock className="h-10" />
    <SkeletonBlock className="h-10" />
    <SkeletonBlock className="h-10" />
    <SkeletonBlock className="h-10" />
  </div>
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

/** A titled table placeholder: header bar + striped rows (All-Time Leaders,
 * Events Through the Years). */
export const SkeletonSection = ({ rows = 6 }) => (
  <div className="space-y-3">
    <SkeletonBlock className="w-44 h-6" />
    <div className="overflow-hidden card">
      <SkeletonBlock className="h-9 !rounded-none" />
      <div className="p-3 space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div className="flex items-center gap-3" key={i}>
            <SkeletonBlock className="w-6 h-4" />
            <SkeletonBlock className="flex-grow h-4" />
            <SkeletonBlock className="w-10 h-4" />
            <SkeletonBlock className="w-8 h-4" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
