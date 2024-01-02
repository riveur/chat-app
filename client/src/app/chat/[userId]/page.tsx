"use client";

import { ChatRoom } from "@/components/chat-room";
import { useAuth } from "@/hooks/useAuth";
import { useReceiveMessageMutation } from "@/hooks/useReceiveMessageMutation";
import { useSendMessageMutation } from "@/hooks/useSendMessageMutation";
import { socket } from "@/lib/socket";
import { MessageSchema as Message, UserSchema as User } from "@/lib/validation";
import { useConnectedUsersStore } from "@/stores/useConnectedUsersStore";
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
  const initConnectedUsers = useConnectedUsersStore(state => state.init);
  const addConnectedUser = useConnectedUsersStore(state => state.add);
  const removeConnectedUser = useConnectedUsersStore(state => state.remove);

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

    const onInitConnectedUsers = (users: Array<User['id']>) => {
      console.log(users);
      initConnectedUsers(users);
    }

    const onUserConnected = (userId: User['id']) => {
      addConnectedUser(userId);
    }

    const onUserDisconnected = (userId: User['id']) => {
      removeConnectedUser(userId);
    }

    socket.on('receive:message', onReceiveMessage);
    socket.on('init:connected-users', onInitConnectedUsers);
    socket.on('user:connected', onUserConnected);
    socket.on('user:disconnected', onUserDisconnected);

    return () => {
      socket.off('receive:message', onReceiveMessage);
      socket.off('init:connected-users', onInitConnectedUsers);
      socket.off('user:connected', onUserConnected);
      socket.off('user:disconnected', onUserDisconnected);
    }
  });

  const handleSubmit = async (data: { content: string }) => {
    sendMessage({ content: data.content, receiver_id: Number(params.userId) }, {
      onSettled: () => formRef.current?.reset()
    });
  }

  if (!user) return null;

  return (
    <main className="container h-full">
      <ChatRoom>
        <ChatRoom.LeftSide>
          <ChatRoom.Header />
          <ChatRoom.UserList activeUserId={Number(params.userId)} />
          <ChatRoom.Footer />
        </ChatRoom.LeftSide>
        <ChatRoom.RightSide>
          <ChatRoom.TopBar />
          <ChatRoom.Conversations activeUserId={Number(params.userId)} currentUserId={user.id} />
          <ChatRoom.Form ref={formRef} onSubmit={handleSubmit} />
        </ChatRoom.RightSide>
      </ChatRoom>
    </main>
  )
}