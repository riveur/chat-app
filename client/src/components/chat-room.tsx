"use client";

import { useAppContext } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { HTMLAttributes, forwardRef, FC, useState, useRef, useEffect } from "react";
import { Message, User } from "@/app/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageSquare, Frown } from 'lucide-react';
import { SendMessageForm, SendMessageFormInputs } from "./forms/send-message-form";
import { SubmitHandler } from "react-hook-form";
import { socket } from "@/lib/socket";

export const ChatRoom: FC<{ users?: User[], conversations?: Record<User['id'], Message[]> }> = ({ users = [], conversations = {} }) => {
    const { user, setUser } = useAppContext();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const messages = (selectedUser && conversations[selectedUser.id]) ? conversations[selectedUser.id] : [];

    useEffect(() => {
        if (!users.find(u => u.id === selectedUser?.id)) {
            setSelectedUser(null);
        }
    }, [users, selectedUser]);

    if (!user) {
        return null;
    }

    const handleSendMessageSubmit: SubmitHandler<SendMessageFormInputs> = ({ message }, event) => {
        socket.emit('send:message', { message, receiverId: selectedUser?.id, senderId: user.id });
        formRef?.current?.reset();
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
                            {users.map((u) => <UserCard key={u.id} user={u} onClick={() => setSelectedUser(u)} active={selectedUser?.id === u.id} />)}
                        </div>
                    </aside>
                    <div className="h-full w-full border-x">
                        <div className="h-full w-full flex flex-col">
                            <div className="border-b h-16 p-4 flex justify-between items-center">
                                <span className="font-bold">Messages</span>
                                <Button>Log out</Button>
                            </div>
                            <div className="h-full p-4 overflow-y-auto">
                                <div className="h-full flex flex-col gap-6">
                                    {users.length !== 0 ?
                                        <Messages messages={messages} senderId={user.id} users={users} /> :
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
                                <SendMessageForm ref={formRef} onSubmit={handleSendMessageSubmit} />
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

const ChatMessage = forwardRef<HTMLDivElement, { message: string, user?: User, received: boolean } & HTMLAttributes<HTMLDivElement>>(({ message, user, received, className, ...props }, ref) => {
    return (
        <div ref={ref} {...props} className={cn(className, 'flex items-center gap-4', !received && 'flex-row-reverse')}>
            {received && <UserAvatar username={user?.username} />}
            <span className={cn('border border-border rounded-full py-2 px-4', received ? 'bg-secondary' : 'dark:bg-blue-500 bg-slate-300')}>{message}</span>
        </div>
    );
});

ChatMessage.displayName = "ChatMessage";

const Messages: FC<{ messages: Message[], senderId: string, users?: User[] }> = ({ messages, senderId, users = [] }) => {
    return (
        <>
            {messages.length !== 0 ?
                messages.map((message, idx) => <ChatMessage key={idx} message={message.message} received={message.receiverId === senderId} user={users.find(u => u.id === message.senderId)} />) :
                <div className="flex justify-center items-center h-full">
                    <div className="flex flex-col items-center gap-4">
                        <MessageSquare size={60} />
                        <p className="font-bold text-lg">Send a message to start the conversation</p>
                    </div>
                </div>}
        </>
    )
}