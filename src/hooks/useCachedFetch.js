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
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!key) return undefined;
    let alive = true;
    const hit = cache.has(key);
    setData(cache.get(key));
    setLoading(!hit);
    setRefreshing(hit);
    fetcherRef.current()
      .then((fresh) => {
        cache.set(key, fresh);
        if (alive) setData(fresh);
      })
      .catch((error) => console.error(`fetch ${key} failed:`, error))
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

  return { data, loading, refreshing };
};

export default useCachedFetch;
