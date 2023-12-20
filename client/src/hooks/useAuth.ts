"use client";

import { getUser } from "@/lib/client";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useAuth() {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const query = useQuery({
    queryKey: QUERIES_KEYS.auth,
    queryFn: getUser,
    retry: false,
    refetchOnMount: false,
    onError(err) {
      router.replace('/login');
    },
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
}