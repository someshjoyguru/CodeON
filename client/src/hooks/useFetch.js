import { useCallback, useEffect, useRef, useState } from 'react';

export default function useFetch(fn, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const mounted = useRef(false);

  const run = useCallback(async () => {
    setLoading(true); setError(null);
    try { const res = await fn(); setData(res); } catch (e) { setError(e); } finally { setLoading(false); }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!immediate) return; if (mounted.current) return; mounted.current = true; run();
  }, [run, immediate]);

  return { data, error, loading, refetch: run };
}
