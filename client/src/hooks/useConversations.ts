import { getConversations } from "@/lib/client";
import { UserSchema } from "@/lib/validation";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useQuery } from "react-query";

export function useConversations(userId: UserSchema['id']) {
  const query = useQuery({
    queryKey: [QUERIES_KEYS.conversations, userId],
    queryFn: () => getConversations(userId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  return query;
}