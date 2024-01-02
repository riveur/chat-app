"use client";

import { getCurrentUser } from "@/lib/client";
import { socket } from "@/lib/socket";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";

export function useAuth() {
  const router = useRouter();
  return useQuery({
    queryKey: QUERIES_KEYS.auth,
    queryFn: getCurrentUser,
    retry: false,
    refetchOnMount: false,
    onError(err) {
      if (socket.connected) {
        socket.disconnect();
      }
      router.replace('/login');
    },
  });
}