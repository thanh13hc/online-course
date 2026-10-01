import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import Topbar from "@/components/TopBar";
import { useChatStore } from "@/stores/useChatStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/clerk-react";
import React, { use, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

let initial = true;
function ChatPage() {
  const { user } = useUser();
  const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.clerkId);
    }
  }, [fetchMessages, selectedUser]);

  useEffect(() => {
    if (!messages.length || !containerRef.current) return;

    if (initial) {
      lastMsgRef.current?.scrollIntoView();
      initial = false;
      return;
    }

    const newMessage = messages.at(-1);

    const isSentByMe = newMessage?.senderId === user?.id;

    const container = containerRef.current.querySelector(
      "#scroll-area__container",
    );
    const isNearBottom =
      container!.scrollHeight - container!.scrollTop - container!.clientHeight <
      100;

    if (isSentByMe || isNearBottom) {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, user?.id]);

  useEffect(() => {
    return () => {
      initial = true;
    };
  }, [selectedUser]);

  return (
    <main className="h-full rounded-lg bg-linear-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Topbar />

      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px-1fr] h-[calc(100vh-180px)]">
        <UsersList />

        <div className="flex flex-col h-full">
          {selectedUser ? (
            <>
              <ChatHeader />

              <ScrollArea
                className="h-[calc(100vh-340px)]"
                id="container"
                ref={containerRef}
              >
                {/* <div className="p-4 space-y-4" id="container2"> */}
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex items-start gap-3 ${msg.senderId === user?.id ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="size-8">
                      <AvatarImage
                        src={
                          msg.senderId === user?.id
                            ? user.imageUrl
                            : selectedUser.imageUrl
                        }
                      />
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 max-w-[70%] ${msg.senderId === user?.id ? "bg-green-500" : "bg-zinc-800"}`}
                    >
                      <p className="text-sm"> {msg.content}</p>
                      <span className="text-xs text-zinc-300 mt-1 block">
                        {msg.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={lastMsgRef} />
                {/* </div> */}
              </ScrollArea>
              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
}

export default ChatPage;

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState("");
  const { selectedUser, sendMessage } = useChatStore();
  const { user } = useUser();

  const handleSend = () => {
    if (!selectedUser || !user || !newMessage) {
      return;
    }

    sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
    setNewMessage("");
  };

  return (
    <div className="p-4 mt-auto border-t border-zinc-800">
      <div className="flex gap-2">
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="bg-zinc-800 border-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()}>
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const ChatHeader = () => {
  const { selectedUser, onlineUsers } = useChatStore();

  if (!selectedUser) return null;

  return (
    <div className="p-4 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={selectedUser.imageUrl} />
          <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{selectedUser.fullName}</h2>
          <p className="text-sm text-zinc-400">
            {onlineUsers.has(selectedUser.clerkId) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};

const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="/spotify.png" alt="Spotify" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);

const UsersList = () => {
  const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } =
    useChatStore();

  return (
    <div className="border-r border-zinc-800">
      <div className="flex flex-col h-full">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-2 p-4">
            {isLoading ? (
              <UsersListSkeleton />
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center justify-center lg:justify-start gap-3 p-3 
										rounded-lg cursor-pointer transition-colors
                    ${selectedUser?.clerkId === user.clerkId ? "bg-zinc-800" : "hover:bg-zinc-800/50"}`}
                >
                  <div className="relative">
                    <Avatar className="size-8 md:size-12">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    {/* online indicator */}
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
                        ${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-500"}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0 lg:block hidden">
                    <span className="font-medium truncate">
                      {user.fullName}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
