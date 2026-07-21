/** The Show More footer for capped lists: renders nothing once everything
 * is on screen. `total` may exceed what's fetched (server-side limit) --
 * the parent's onMore both reveals more and fetches more. */
const ShowMore = ({ shown, total, onMore }) => {
  if (total == null || shown >= total) return null;
  return (
    <button
      type="button"
      className="w-full py-2 mt-1 text-sm font-semibold transition-colors rounded-lg text-primary hover:bg-primary/5"
      onClick={onMore}
    >
      Show more ({shown} of {total})
    </button>
  );
};

export default ShowMore;
