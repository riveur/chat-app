"use client";

import { useAppContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { HTMLAttributes, forwardRef, FC, useState } from "react";
import { Message, User } from "@/app/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useMessages, useUsers } from "@/lib/hooks";
import { MessageSquare, Frown } from 'lucide-react';

export function ChatRoom() {
    const { user, setUser } = useAppContext();
    const { messages } = useMessages('');
    const { users } = useUsers();

    if (!user) {
        return null;
    }

    return (
        <div className="container h-full">
            <section className="h-full flex flex-col">
                <div className="flex w-full h-full overflow-hidden">
                    <aside className="min-w-[300px] h-full overflow-y-auto border-l">
                        <div className="h-16 grid content-center">
                            <h1 className="text-center text-xl font-bold">Chat App</h1>
                        </div>
                        <div className="flex flex-col">
                            {users.map((u, idx) => <UserCard key={idx} user={u} />)}
                        </div>
                    </aside>
                    <div className="h-full w-full border-x">
                        <div className="h-full w-full flex flex-col">
                            <div className="border-b h-16 p-4 flex justify-between items-center">
                                <span className="font-bold">Messages</span>
                                <Button onClick={() => setUser(null)}>Log out</Button>
                            </div>
                            <div className="h-full p-4 overflow-y-auto">
                                <div className="h-full flex flex-col gap-6">
                                    {messages.length !== 0 ?
                                        <Messages messages={messages} userId={user.id} /> :
                                        <div className="h-full grid content-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Frown size={60} />
                                                <p className="font-bold text-lg">There is no users</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="flex-shrink border-t">
                                <form>
                                    <div className="px-4 flex items-center justify-between">
                                        <Input id="message" name="message" className="h-14 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Your message" />
                                        <Button size="icon" className="rounded-full"><SendHorizonal size={16} /></Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

const UserAvatar: FC<{ username?: string }> = ({ username = 'u' }) => {
    return (
        <Avatar>
            <AvatarImage src={`https://ui-avatars.com/api/?background=random&name=${username}`} />
            <AvatarFallback>{username.at(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
    );
};

const UserCard = forwardRef<HTMLDivElement, { user: User, active?: boolean } & HTMLAttributes<HTMLDivElement>>(({ user, active = false, ...props }, ref) => {
    return (
        <div
            ref={ref}
            {...props}
            className={cn(
                'flex gap-4 items-center px-4 py-4 hover:bg-secondary hover:cursor-pointer',
                active && 'bg-secondary'
            )}
        >
            <UserAvatar username={user.username} />
            <span className="font-semibold">{user.username}</span>
        </div>
    );
});

UserCard.displayName = "UserCard";

const ChatMessage = forwardRef<HTMLDivElement, { message: string, senderId: string, received: boolean } & HTMLAttributes<HTMLDivElement>>(({ message, senderId, received, className, ...props }, ref) => {
    return (
        <div ref={ref} {...props} className={cn(className, 'flex items-center gap-4', !received && 'flex-row-reverse')}>
            {received && <UserAvatar username={senderId} />}
            <span className={cn('border border-border rounded-full py-2 px-4', received ? 'bg-secondary' : 'dark:bg-blue-500 bg-slate-300')}>{message}</span>
        </div>
    );
});

ChatMessage.displayName = "ChatMessage";

const Messages: FC<{ messages: Message[], userId: string }> = ({ messages, userId }) => {
    return (
        <>
            {messages.length !== 0 ?
                messages.map((message, idx) => <ChatMessage key={idx} {...message} received={message.senderId !== userId} />) :
                <div className="flex justify-center items-center h-full">
                    <div className="flex flex-col items-center gap-4">
                        <MessageSquare size={60} />
                        <p className="font-bold text-lg">Send a message to start the conversation</p>
                    </div>
                </div>}
        </>
    )
}