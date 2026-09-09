import { useChatStore } from "../store/useChatStore";
import { useEffect, useState, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { authUser } = useAuthStore();
  const endMessageRef = useRef(null);
  const containerRef = useRef(null);

  const [isInitialMount, setIsInitialMount] = useState(true);

  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subcribeToMessages,
    unsubcribeToMessages,
  } = useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);

    subcribeToMessages();
    return () => {
      unsubcribeToMessages();
      setIsInitialMount(true);
    };
  }, [selectedUser?._id]);

  useEffect(() => {
    const container = containerRef.current;
    const el = endMessageRef.current;

    if (!el || !messages.length) return;

    const lastMessage = messages[messages.length - 1];

    if (isInitialMount) {
      el.scrollIntoView();
      setIsInitialMount(false);
    }

    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <= 100;
    const isMyMessage = authUser._id === lastMessage.senderId;

    if (nearBottom || isMyMessage) el.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser?._id, messages, isInitialMount]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        id="hele"
        ref={containerRef}
      >
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message?.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    (message.senderId === authUser._id
                      ? authUser.profilePic
                      : selectedUser.profilePic) || "/avatar.png"
                  }
                  alt=""
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-sm opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <div className="w-58 h-58">
                  <img
                    src={message.image}
                    className="w-full h-full object-contain rounded-md mb-2"
                  />
                </div>
              )}

              {message.text && <p className="">{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={endMessageRef} />
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
