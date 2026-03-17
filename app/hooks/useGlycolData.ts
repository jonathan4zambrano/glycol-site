"use client";

import { useState, useEffect, useCallback } from "react";
import type { GlycolApiResponse } from "@/app/types/glycol";

const POLL_INTERVAL = 15_000;

export function useGlycolData() {
  const [data, setData] = useState<GlycolApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/glycol");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: GlycolApiResponse = await res.json();
      setData(json);
      setError(json.error ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchData]);

  return { data, loading, error };
}
