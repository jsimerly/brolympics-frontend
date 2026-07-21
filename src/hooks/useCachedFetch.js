import { useEffect, useRef, useState } from "react";

const cache = new Map();

/** Stale-while-revalidate: if we've seen this key before, render the cached
 * copy instantly and refresh in the background; only first-ever loads report
 * `loading`. Mutations currently full-page-reload, which resets the cache, so
 * post-write staleness is not a concern. `key` of null skips fetching. */
const useCachedFetch = (key, fetcher) => {
  const [data, setData] = useState(() => (key ? cache.get(key) : undefined));
  const [loading, setLoading] = useState(() => Boolean(key) && !cache.has(key));
  const [refreshing, setRefreshing] = useState(false);
  // surfaced so pages can react to "this thing doesn't exist anymore" instead
  // of skeleton-ing forever (the prod ghost-bro incident, 2026-07-21)
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!key) return undefined;
    let alive = true;
    const hit = cache.has(key);
    setData(cache.get(key));
    setLoading(!hit);
    setRefreshing(hit);
    setError(null);
    fetcherRef.current()
      .then((fresh) => {
        cache.set(key, fresh);
        if (alive) setData(fresh);
      })
      .catch((fetchError) => {
        console.error(`fetch ${key} failed:`, fetchError);
        if (alive) setError(fetchError);
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
          setRefreshing(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [key]);

  return { data, loading, refreshing, error };
};

export default useCachedFetch;
