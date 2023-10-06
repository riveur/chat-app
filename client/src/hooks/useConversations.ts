import { getConversations, getUsers } from "@/lib/client";
import { UserSchema } from "@/lib/validation";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useChatRoomStore } from "@/stores/useChatRoomStore";
import { useQuery } from "react-query";

export function useConversations(userId?: UserSchema['id']) {
  const setConversations = useChatRoomStore(state => state.setConversations);
  return useQuery({
    queryKey: QUERIES_KEYS.conversations,
    queryFn: () => getConversations(userId),
    onSuccess(data) {
      if (data) {
        setConversations(data);
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity
  });
}