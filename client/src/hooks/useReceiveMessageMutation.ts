import { MessageSchema as Message } from "@/lib/validation";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useMutation, useQueryClient } from "react-query";

export function useReceiveMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: Message) => Promise.resolve(message),
    onSettled(_, __, message) {
      const queryKey = [QUERIES_KEYS.conversations, message.sender_id];
      const previousConversations = queryClient.getQueryData<Message[]>(queryKey);

      if (previousConversations) {
        queryClient.setQueryData<Message[]>(queryKey, [...previousConversations, message]);
      }
    }
  });
}