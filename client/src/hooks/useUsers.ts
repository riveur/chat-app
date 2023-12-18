import { getUsers } from "@/lib/client";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useQuery } from "react-query";

export function useUsers() {
  return useQuery({
    queryKey: QUERIES_KEYS.users,
    queryFn: getUsers,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity,
  });
}