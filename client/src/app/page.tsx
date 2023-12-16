"use client";

import { ChatRoom } from "@/components/chat-room";
import { ThemeToggler } from "@/components/themes/theme-toggler";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { useChatRoomStore } from "@/stores/useChatRoomStore";
import { useAuth } from "@/hooks/useAuth";
import { UserSchema as User, MessageSchema as Message } from "@/lib/validation";
import { useClient } from "@/hooks/useClient";

export default function Home() {
  const { addMessageToConversation } = useChatRoomStore();
  const isClient = useClient();

  const { data: user } = useAuth();

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

  if (!isClient || !user) {
    return null;
  }

  return (
    <main className="h-full">
      <ChatRoom user={user} />
      <div className="fixed bottom-0 right-0">
        <div className="relative p-2">
          <ThemeToggler />
        </div>
      </div>
    </main>
  )
}
