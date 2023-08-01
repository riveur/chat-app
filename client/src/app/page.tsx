"use client";

import { ChatRoom } from "@/components/chat-room";
import { LoginForm } from "@/components/forms/login-form";
import { useAppContext } from "@/components/providers/app-provider";
import { ThemeToggler } from "@/components/themes/theme-toggler";
import { useEffect, useState } from "react";

export default function Home() {
  const { isLoggedIn } = useAppContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true)
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <main className="h-full">
      {isLoggedIn() ?
        <ChatRoom /> :
        (<div className="h-screen flex justify-center items-center">
          <div className="w-[500px] px-6">
            <LoginForm />
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
