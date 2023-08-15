"use client";

import { ChatRoom } from "@/components/chat-room";
import { LoginForm, LoginFormInputs } from "@/components/forms/login-form";
import { useAppContext } from "@/components/providers/app-provider";
import { ThemeToggler } from "@/components/themes/theme-toggler";
import { socket } from "@/lib/socket";
import { useEffect, useReducer, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { ConversationsReducerActions, Message, User } from "@/app/types";
import { conversationsReducer } from "@/lib/hooks";

export default function Home() {
  const { setUser } = useAppContext();
  const [isClient, setIsClient] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, dispatch] = useReducer(conversationsReducer, {});

  const onSubmitLogin: SubmitHandler<LoginFormInputs> = ({ username }) => {
    socket.emit('user:login', { username });
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const onUserConnected = ({ user, state }: { user: User, state: User[] }) => {
      setUser(user);
      setUsers(state);
      setIsConnected(true);
    };

    const onUserDisconnected = (userId: User['id']) => {
      setUsers(state => state.filter(u => u.id !== userId));
    }

    const onUserNew = (user: User) => {
      setUsers(state => {
        return [...state, user];
      })
    };

    const onReceiveMessage = ({ message, senderId, receiverId }: Message) => {
      dispatch({ type: ConversationsReducerActions.ADD_MESSAGE, payload: { message, senderId, receiverId } });
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
  }, [setUser, users, conversations]);

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
