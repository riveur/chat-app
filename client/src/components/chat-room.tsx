"use client";

import { Button } from "@/components/ui/button";
import { HTMLAttributes, forwardRef, FC, useRef, useEffect, } from "react";
import { UserSchema as User, MessageSchema as Message } from "@/lib/validation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, Loader2, LogOut, MessageSquare, Moon, Palette, RotateCw, Settings, Sun } from 'lucide-react';
import { SendMessageForm, SendMessageFormInputs } from "./forms/send-message-form";
import { SubmitHandler } from "react-hook-form";
import { logout } from "@/lib/client";
import { socket } from "@/lib/socket";
import { useQueryClient } from "react-query";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import Link, { LinkProps } from "next/link";
import { useUsers } from "@/hooks/useUsers";
import { Skeleton } from "./ui/skeleton";
import { useConversations } from "@/hooks/useConversations";
import { useUserStore } from "@/stores/useUserStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useUser } from "@/hooks/useUser";
import { useConnectedUsersStore } from "@/stores/useConnectedUsersStore";


export const ChatRoom = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="h-full flex overflow-hidden">
      {children}
    </div>
  );
}

const LeftSide = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-w-[300px] h-full flex flex-col border-l">
      {children}
    </div>
  );
}

ChatRoom.LeftSide = LeftSide;

const Header = ({ title = 'Chat app' }: { title?: string }) => {
  return (
    <div className="min-h-[4rem] grid content-center">
      <h1 className="text-center text-xl font-bold">{title}</h1>
    </div>
  );
}

ChatRoom.Header = Header;

const UserList = ({ activeUserId }: { activeUserId?: User['id'] }) => {
  const { data: users, isLoading, isSuccess, isError, refetch } = useUsers();

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {isLoading && Array.from({ length: 4 }).map((_, idx) => <SkeletonUserCard key={idx} />)}
      {isError &&
        <div className="px-4 py-4 flex flex-col items-center gap-2">
          <AlertTriangle size={30} />
          <p className="font-bold text-lg">Error fetching users</p>
          <Button className="flex gap-2 items-center" variant="ghost" onClick={() => refetch()}>
            <RotateCw className="w-4 h-4" />
            <span>Retry</span>
          </Button>
        </div>
      }
      {isSuccess && users.map((u) => <UserCard key={u.id} user={u} active={activeUserId === u.id} />)}
    </div>
  );
}

ChatRoom.UserList = UserList;

const ChatRoomSettingsDropdown = () => {
  const { setTheme, theme } = useTheme();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout()
      .then(() => {
        socket.disconnect();
        queryClient.invalidateQueries(QUERIES_KEYS.auth);
      });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme('light')}
                className="flex items-center gap-2"
              >
                {theme !== 'light' ? <Sun className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('dark')}
                className="flex items-center gap-2 w-full"
              >
                {theme !== 'dark' ? <Moon className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                Dark
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center justify-start gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Footer = () => {
  const user = useUserStore(state => state.user);

  return (
    <div className="flex justify-between items-center border-t p-2">
      <div className="flex items-center gap-2">
        <UserAvatar url={user?.avatar_url} />
        <span className="font-semibold">{user?.username}</span>
      </div>
      <ChatRoomSettingsDropdown />
    </div>
  );
}

ChatRoom.Footer = Footer;

const RightSide = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex flex-col border-x">
      {children}
    </div>
  );
}

ChatRoom.RightSide = RightSide;

const TopBar = ({ title = 'Messages' }: { title?: string }) => {

  return (
    <div className="border-b h-16 p-4 flex justify-between items-center">
      <span className="font-bold">{title}</span>
    </div>
  );
}

ChatRoom.TopBar = TopBar;

const Conversations = ({ activeUserId, currentUserId }: { activeUserId: User['id'], currentUserId: User['id'] }) => {
  const messagesWrapperRef = useRef<HTMLDivElement>(null);

  const { data: activeUser, isSuccess: isSucessActiveUser } = useUser(activeUserId);
  const {
    data: conversations,
    isSuccess: isSuccessConversations,
    isLoading: isLoadingConversations,
    isError: isErrorConversations,
    refetch: refetchConversations
  } = useConversations(activeUserId, { enabled: !!activeUser });

  useEffect(() => {
    if (messagesWrapperRef.current) {
      messagesWrapperRef.current.scrollTop = messagesWrapperRef.current.scrollHeight;
    }
  }, [conversations]);

  return (
    <div ref={messagesWrapperRef} className="h-full flex flex-col gap-6 p-4 overflow-y-auto">
      {isLoadingConversations &&
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin" size={30} />
            <p className="font-bold text-lg">Loading messages...</p>
          </div>
        </div>
      }
      {isErrorConversations &&
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle size={30} />
            <p className="font-bold text-lg">Error fetching messages</p>
            <Button className="flex gap-2 items-center" variant="ghost" onClick={() => refetchConversations()}>
              <RotateCw className="w-4 h-4" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      }
      {(isSuccessConversations && isSucessActiveUser && (conversations.length !== 0)) && <Messages messages={conversations} senderId={currentUserId} />}
      {isSuccessConversations && (conversations.length === 0) &&
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center gap-4">
            <MessageSquare size={60} />
            <p className="font-bold text-lg">Send a message to start the conversation</p>
          </div>
        </div>
      }
    </div>
  );
}

ChatRoom.Conversations = Conversations;

const Form = forwardRef<HTMLFormElement, { onSubmit: SubmitHandler<SendMessageFormInputs> }>(({ onSubmit }, ref) => {
  return (
    <div className="flex-shrink border-t">
      <SendMessageForm ref={ref} onSubmit={onSubmit} />
    </div>
  );
});

Form.displayName = 'Form';
ChatRoom.Form = Form;

const UserAvatar: FC<{ url?: string, status?: 'active' | 'inactive', showStatus?: boolean }> = ({ url, showStatus = false, status = 'inactive' }) => {
  const statusClass = { active: 'bg-green-500', 'inactive': 'bg-gray-500' }[status];
  return (
    <div className="relative">
      <Avatar>
        <AvatarImage src={url} />
      </Avatar>
      {showStatus && <span className={cn("h-3 w-3 rounded-full absolute right-0 bottom-0 border", statusClass)}></span>}
    </div>
  );
};

interface UserCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, Omit<LinkProps, 'href'> {
  user: User;
  active?: boolean;
}

const UserCard = forwardRef<HTMLAnchorElement, UserCardProps>(({ user, active = false, ...props }, ref) => {
  const connectedUsers = useConnectedUsersStore(state => state.connectedUsers);

  return (
    <Link
      ref={ref}
      className={cn(
        'flex gap-4 items-center px-4 py-4 hover:bg-secondary hover:cursor-pointer',
        active && 'bg-secondary'
      )}
      href={`/chat/${user.id}`}
      {...props}
    >
      <UserAvatar url={user.avatar_url} showStatus status={connectedUsers.has(user.id) ? 'active' : 'inactive'} />
      <span className="font-semibold">{user.username}</span>
    </Link>
  );
});

UserCard.displayName = "UserCard";

const SkeletonUserCard = () => {
  return (
    <div className="flex gap-4 items-center px-4 py-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  );
}

const ChatMessage = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & {
  message: Message,
  currentUserId: User['id'],
}>(({ message, currentUserId, className, ...props }, ref) => {
  const isSent = message.sender_id === currentUserId;
  const { data: activeUser } = useUser(message.sender_id);
  return (
    <div ref={ref} {...props} className={cn(className, 'flex items-center gap-4', isSent && 'flex-row-reverse')}>
      {!isSent && <UserAvatar url={activeUser?.avatar_url} />}
      <span
        className={cn('border border-border rounded-full py-2 px-4', isSent ? 'dark:bg-blue-500 bg-slate-300' : 'bg-secondary')}
      >
        {message.content}
      </span>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

const Messages: FC<{ messages: Message[], senderId: number }> = ({ messages, senderId }) => {
  return (
    <>
      {
        messages.map((message, idx) =>
          <ChatMessage
            key={idx}
            message={message}
            currentUserId={senderId}
          />)
      }
    </>
  );
}