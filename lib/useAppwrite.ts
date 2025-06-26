// lib/useAppwrite.ts

import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

// Interface untuk opsi yang diterima oleh hook
interface UseAppwriteOptions<T, P extends Record<string, any>> {
  fn: (params: P) => Promise<T>; // Fungsi Appwrite yang akan dieksekusi
  params?: P; // Parameter untuk fungsi tersebut
  skip?: boolean; // Opsi untuk melewati eksekusi awal
}

// Interface untuk nilai yang dikembalikan oleh hook
interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

export const useAppwrite = <T, P extends Record<string, any>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  useEffect(() => {
    if (!skip) {
      fetchData(params).catch((err) => {
        console.error("Error dalam efek useAppwrite:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [skip, JSON.stringify(params)]);

  const refetch = async (newParams?: P) => {
    await fetchData(newParams || params);
  };

  return { data, loading, error, refetch };
};