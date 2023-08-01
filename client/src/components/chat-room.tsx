"use client";

import { useAppContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { users } from "@/data";
import { HTMLAttributes, forwardRef, FC, useState } from "react";
import { Message, User } from "@/app/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useMessages } from "@/lib/hooks";
import { MessageSquare } from 'lucide-react';

export function ChatRoom() {
    const { user, setUser } = useAppContext();
    const [room, setRoom] = useState('0:0');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const { messages } = useMessages(room);

    if (!user) {
        return null;
    }

    if (!users.find(u => u.id === user.id)) {
        users.push(user);
    }

    const handleClickUserCard = (userId: string) => {
        setRoom(`${user.id}:${userId}`);
        setSelectedUser(userId);
    }

    return (
        <div className="container h-full">
            <section className="h-full border-x border-border flex flex-col">
                <div className="w-full border-b border-border flex">
                    <div className="min-w-[300px] px-4 py-4 h-20 grid content-center">
                        <h1 className="text-center text-xl font-bold">Chat App</h1>
                    </div>
                    <div className="p-4 border-l border-border flex justify-between items-center w-full">
                        <h2 className="font-semibold text-lg">{user.username}</h2>
                        <div>
                            <Button onClick={() => setUser(null)}>Log out</Button>
                        </div>
                    </div>
                </div>
                <div className="flex w-full overflow-hidden">
                    <aside className="min-w-[300px] h-full overflow-y-auto p-4">
                        <div className="flex flex-col gap-4">
                            {users.map((u, idx) => <UserCard key={idx} user={u} active={u.id === selectedUser} onClick={() => handleClickUserCard(u.id)} />)}
                        </div>
                    </aside>
                    <div className="border-l border-border h-full w-full">
                        <div className="h-full w-full flex flex-col">
                            <div className="h-full p-4 overflow-y-auto">
                                <div className="h-full flex flex-col gap-6">
                                    {
                                        room === '0:0' ?
                                            <div className="flex justify-center items-center h-full">
                                                <p className="font-bold text-lg">Choose a conversation</p>
                                            </div> :
                                            <Messages messages={messages} userId={user.id} />
                                    }
                                </div>
                            </div>
                            <div className="border-t border-border flex-shrink">
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
                'flex gap-4 items-center border rounded px-4 p-2 hover:bg-secondary hover:cursor-pointer',
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
            {received && <UserAvatar username={users.find(user => user.id === senderId)?.username} />}
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