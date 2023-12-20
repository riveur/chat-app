import { sendMessage } from "@/lib/client";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useMutation, useQueryClient } from "react-query";
import type { MessageSchema as Message, UserSchema as User } from "@/lib/validation";

export function useSendMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess(data) {
      const queryKey = [QUERIES_KEYS.conversations, data.receiver_id];
      const previousConversations = queryClient.getQueryData<Message[]>(queryKey);

      if (previousConversations) {
        queryClient.setQueryData<Message[]>(queryKey, [...previousConversations, data]);
      }
    }
  });
}