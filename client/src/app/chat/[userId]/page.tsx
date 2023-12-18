"use client";

import { ChatRoom } from "@/components/chat-room";
import { ThemeToggler } from "@/components/themes/theme-toggler";
import { useAuth } from "@/hooks/useAuth";
import { useClient } from "@/hooks/useClient";
import { useConversations } from "@/hooks/useConversations";
import { sendMessage } from "@/lib/client";
import { socket } from "@/lib/socket";
import { MessageSchema as Message } from "@/lib/validation";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useChatRoomStore } from "@/stores/useChatRoomStore";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useRef } from "react";
import { useQueryClient } from "react-query";

interface ChatPageProps {
  params: { userId: string }
}

export default function Page({ params }: ChatPageProps) {
  const isClient = useClient();
  const formRef = useRef<HTMLFormElement>(null);
  const conversations = useChatRoomStore(state => state.conversations);
  const addMessageToConversation = useChatRoomStore(state => state.addMessageToConversation);
  const user = useUserStore(state => state.user);
  const queryClient = useQueryClient();

  useAuth();
  useConversations(Number(params.userId));

  useEffect(() => {
    if (user) {
      socket.connect();
    }
  }, [user]);

  useEffect(() => {
    const onReceiveMessage = (message: Message) => {
      addMessageToConversation(message);
    };

    socket.on('receive:message', onReceiveMessage);

    return () => {
      socket.off('receive:message', onReceiveMessage);
    }
  });

  const handleSubmit = async (data: { content: string }) => {
    sendMessage({ content: data.content, receiver_id: Number(params.userId) })
      .then(() => {
        queryClient.invalidateQueries([QUERIES_KEYS.conversations, Number(params.userId)]);
      })
      .finally(() => {
        formRef.current?.reset();
      });
  }

  if (!user || !isClient) return null;

  return (
    <main className="h-full">
      <ChatRoom>
        <ChatRoom.RightSide>
          <ChatRoom.Header />
          <ChatRoom.UserList activeUserId={Number(params.userId)} />
        </ChatRoom.RightSide>
        <ChatRoom.LeftSide>
          <ChatRoom.TopBar />
          <ChatRoom.Conversations activeUserId={Number(params.userId)} currentUserId={user.id} />
          <ChatRoom.Form ref={formRef} onSubmit={handleSubmit} />
        </ChatRoom.LeftSide>
      </ChatRoom>
      <div className="fixed bottom-0 right-0">
        <div className="relative p-2">
          <ThemeToggler />
        </div>
      </div>
    </main>
  )
}