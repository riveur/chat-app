"use client";

import { Button } from "@/components/ui/button";
import { HTMLAttributes, forwardRef, FC, useState, useRef, useEffect, use } from "react";
import { UserSchema as User, MessageSchema as Message } from "@/lib/validation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageSquare, Frown } from 'lucide-react';
import { SendMessageForm, SendMessageFormInputs } from "./forms/send-message-form";
import { SubmitHandler } from "react-hook-form";
import { socket } from "@/lib/socket";
import { useUserStore } from "@/stores/useUserStore";
import { logout } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "react-query";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useChatRoomStore } from "@/stores/useChatRoomStore";
import { useConversations } from "@/hooks/useConversations";
import { useUsers } from "@/hooks/useUsers";

export const ChatRoom = ({ user }: { user: User }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const bottomDivRef = useRef<HTMLDivElement>(null);
    const { users, conversations } = useChatRoomStore();

    useUsers();
    useConversations(user.id);

    useEffect(() => {
        if (!users.find(u => u.id === selectedUser?.id)) {
            setSelectedUser(null);
        }
    }, [users, selectedUser]);

    useEffect(() => {
        bottomDivRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations]);

    if (!user || !conversations) {
        return null;
    }

    const onClickLogout = () => {
        logout()
            .then(() => {
                socket.disconnect();
                queryClient.invalidateQueries([QUERIES_KEYS.auth]);
                router.push('/login');
            });
    }

    const handleSendMessageSubmit: SubmitHandler<SendMessageFormInputs> = ({ content }) => {
        socket.emit('send:message', { content, receiverId: selectedUser?.id, senderId: user.id });
        formRef?.current?.reset();
    }

    const messages = (selectedUser && conversations[selectedUser.id]) ? conversations[selectedUser.id] : [];

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
                                <Button onClick={() => onClickLogout()}>Log out</Button>
                            </div>
                            <div className="h-full flex flex-col gap-6 p-4 overflow-y-auto">
                                {(users.length !== 0 && selectedUser) && <Messages messages={messages} senderId={user.id} users={users} />}
                                {(users.length === 0) &&
                                    <div className="h-full grid content-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Frown size={60} />
                                            <p className="font-bold text-lg">There is no users</p>
                                        </div>
                                    </div>
                                }
                                {(messages.length === 0 && selectedUser) &&
                                    <div className="flex justify-center items-center h-full">
                                        <div className="flex flex-col items-center gap-4">
                                            <MessageSquare size={60} />
                                            <p className="font-bold text-lg">Send a message to start the conversation</p>
                                        </div>
                                    </div>
                                }
                                <div ref={bottomDivRef}></div>
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

const UserAvatar: FC<{ username?: string, status?: 'active' | 'inactive', showStatus?: boolean }> = ({ username = 'u', showStatus = false, status = 'inactive' }) => {
    const statusClass = { active: 'bg-green-500', 'inactive': 'bg-gray-500' }[status];
    return (
        <div className="relative">
            <Avatar>
                <AvatarImage src={`https://ui-avatars.com/api/?background=random&name=${username}`} />
                <AvatarFallback>{username.at(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            {showStatus && <span className={cn("h-3 w-3 rounded-full absolute right-0 bottom-0 border", statusClass)}></span>}
        </div>
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
            <UserAvatar username={user.username} showStatus status="active" />
            <span className="font-semibold">{user.username}</span>
        </div>
    );
});

UserCard.displayName = "UserCard";

const ChatMessage = forwardRef<HTMLDivElement, {
    content: string,
    user?: User,
    sended: boolean
} & HTMLAttributes<HTMLDivElement>>(({ content, user, sended, className, ...props }, ref) => {
    return (
        <div ref={ref} {...props} className={cn(className, 'flex items-center gap-4', sended && 'flex-row-reverse')}>
            {!sended && <UserAvatar username={user?.username} />}
            <span
                className={cn('border border-border rounded-full py-2 px-4', sended ? 'dark:bg-blue-500 bg-slate-300' : 'bg-secondary')}
            >
                {content}
            </span>
        </div>
    );
});

ChatMessage.displayName = "ChatMessage";

const Messages: FC<{ messages: Message[], senderId: number, users?: User[] }> = ({ messages, senderId, users = [] }) => {
    return (
        <>
            {
                messages.map((message, idx) =>
                    <ChatMessage
                        key={idx}
                        content={message.content}
                        sended={message.sender_id === senderId}
                        user={users.find(u => u.id === message.sender_id)}
                    />)
            }
        </>
    )
}