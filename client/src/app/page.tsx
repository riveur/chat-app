"use client";

import { useAuth } from "@/hooks/useAuth";
import { ChatRoom } from "@/components/chat-room";

export default function Home() {
  useAuth();

  return (
    <main className="container h-full">
      <ChatRoom>
        <ChatRoom.LeftSide>
          <ChatRoom.Header />
          <ChatRoom.UserList />
          <ChatRoom.Footer />
        </ChatRoom.LeftSide>
        <ChatRoom.RightSide>
          <ChatRoom.TopBar />
          <div className="h-full grid content-center">
            <div className="flex flex-col items-center gap-4">
              {/* TODO: Display a message based on users state */}
            </div>
          </div>
        </ChatRoom.RightSide>
      </ChatRoom>
    </main>
  )
}
