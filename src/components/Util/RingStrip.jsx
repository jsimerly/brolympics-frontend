/** The brand signature: a thin strip of the five Olympic ring colors.
 * Use it as an accent under headers instead of coloring components. */
const RingStrip = ({ className = "" }) => (
  <div className={`flex h-1 overflow-hidden rounded-full ${className}`}>
    <div className="flex-1 bg-primary" />
    <div className="flex-1 bg-secondary" />
    <div className="flex-1 bg-near-black" />
    <div className="flex-1 bg-tertiary" />
    <div className="flex-1 bg-red" />
  </div>
);

export default RingStrip;
