import { getConversations } from "@/lib/client";
import { UserSchema } from "@/lib/validation";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useChatRoomStore } from "@/stores/useChatRoomStore";
import { useEffect } from "react";
import { useQuery } from "react-query";

export function useConversations(userId: UserSchema['id']) {
  const setConversations = useChatRoomStore(state => state.setConversations);
  const query = useQuery({
    queryKey: [QUERIES_KEYS.conversations, userId],
    queryFn: () => getConversations(userId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) {
      setConversations(query.data);
    }
  }, [query.data, setConversations]);

  return query;
}