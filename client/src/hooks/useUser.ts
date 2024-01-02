import { getUser } from "@/lib/client";
import { UserSchema as User } from "@/lib/validation";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useQuery } from "react-query";

export const useUser = (id: User['id']) => {
  return useQuery({
    queryFn: () => getUser(id),
    queryKey: [QUERIES_KEYS.users, id],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity,
  });
}