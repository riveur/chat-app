"use client";

import { ChatRoom } from "@/components/chat-room";
import { LoginForm, LoginFormInputs } from "@/components/forms/login-form";
import { ThemeToggler } from "@/components/themes/theme-toggler";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { Message, User } from "@/app/types";
import { useUserStore } from "@/stores/useUserStore";
import { useChatRoomStore } from "@/stores/useChatRoomStore";

export default function Home() {
  const { setUser } = useUserStore();
  const { users, setUsers, addUsers, conversations, addMessageToConversation } = useChatRoomStore();
  const [isClient, setIsClient] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const onSubmitLogin: SubmitHandler<LoginFormInputs> = ({ username }) => {
    socket.emit('user:login', { username });
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const onUserConnected = ({ user, state }: { user: User, state: User[] }) => {
      setUser(user);
      addUsers(state);
      setIsConnected(true);
    };

    const onUserDisconnected = (userId: User['id']) => {
      setUsers(users.filter(u => u.id !== userId));
    }

    const onUserNew = (user: User) => {
      addUsers([user])
    };

    const onReceiveMessage = ({ message, senderId, receiverId }: Message) => {
      addMessageToConversation({ message, senderId, receiverId });
    };

    const onDisconnect = () => {
      setUser(null);
      setUsers([]);
      setIsConnected(false);
    }

    socket.on('user:connected', onUserConnected);
    socket.on('user:disconnected', onUserDisconnected);
    socket.on('user:new', onUserNew);
    socket.on('receive:message', onReceiveMessage);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('user:connected', onUserConnected);
      socket.off('user:disconnected', onUserDisconnected);
      socket.off('user:new', onUserNew);
      socket.off('receive:message', onReceiveMessage);
      socket.off('disconnect', onDisconnect);
    }
  });

  if (!isClient) {
    return null;
  }

  return (
    <main className="h-full">
      {isConnected ?
        <ChatRoom users={users} conversations={conversations} /> :
        (<div className="h-screen flex justify-center items-center">
          <div className="w-[500px] px-6">
            <LoginForm onSubmit={onSubmitLogin} />
          </div>
        </div>)
      }
      <div className="fixed bottom-0 right-0">
        <div className="relative p-2">
          <ThemeToggler />
        </div>
      </div>
    </main>
  )
}
