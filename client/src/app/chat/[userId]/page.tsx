"use client";

import { ChatRoom } from "@/components/chat-room";
import { ThemeToggler } from "@/components/themes/theme-toggler";
import { useAuth } from "@/hooks/useAuth";
import { useReceiveMessageMutation } from "@/hooks/useReceiveMessageMutation";
import { useSendMessageMutation } from "@/hooks/useSendMessageMutation";
import { socket } from "@/lib/socket";
import { MessageSchema as Message } from "@/lib/validation";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useRef } from "react";

interface ChatPageProps {
  params: { userId: string }
}

export default function Page({ params }: ChatPageProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate: sendMessage } = useSendMessageMutation();
  const { mutate: messageReceived } = useReceiveMessageMutation();
  const user = useUserStore(state => state.user);

  useAuth();

  useEffect(() => {
    if (user) {
      socket.connect();
    }
  }, [user]);

  useEffect(() => {
    const onReceiveMessage = (message: Message) => {
      messageReceived(message);
    };

    socket.on('receive:message', onReceiveMessage);

    return () => {
      socket.off('receive:message', onReceiveMessage);
    }
  });

  const handleSubmit = async (data: { content: string }) => {
    sendMessage({ content: data.content, receiver_id: Number(params.userId) }, {
      onSettled: () => formRef.current?.reset()
    });
  }

  if (!user) return null;

  return (
    <main className="h-full">
      <ChatRoom>
        <ChatRoom.LeftSide>
          <ChatRoom.Header />
          <ChatRoom.UserList activeUserId={Number(params.userId)} />
        </ChatRoom.LeftSide>
        <ChatRoom.RightSide>
          <ChatRoom.TopBar />
          <ChatRoom.Conversations activeUserId={Number(params.userId)} currentUserId={user.id} />
          <ChatRoom.Form ref={formRef} onSubmit={handleSubmit} />
        </ChatRoom.RightSide>
      </ChatRoom>
      <div className="fixed bottom-0 right-0">
        <div className="relative p-2">
          <ThemeToggler />
        </div>
      </div>
    </main>
  )
}