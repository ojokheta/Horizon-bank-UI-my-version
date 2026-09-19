'use client';

import { useEffect, useState } from 'react';

export function useSimulatedLoading(duration = 650) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), duration);
    return () => window.clearTimeout(timeout);
  }, [duration]);

  return loading;
}
