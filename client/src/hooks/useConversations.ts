import { getConversations } from "@/lib/client";
import { UserSchema } from "@/lib/validation";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useQuery } from "react-query";

interface UseConversationsOptions {
  enabled?: boolean;
}

export function useConversations(userId: UserSchema['id'], options?: UseConversationsOptions) {
  const { enabled = true } = options || {};

  const query = useQuery({
    queryKey: [QUERIES_KEYS.conversations, userId],
    queryFn: () => getConversations(userId),
    enabled: enabled,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  return query;
}