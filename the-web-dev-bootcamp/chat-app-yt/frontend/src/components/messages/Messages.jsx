import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useAuthContext } from "../../context/AuthContext";
import useListenMessages from "../../hooks/useListenMessages";

function Messages() {
  const { authUser } = useAuthContext();
  const { messages, loading } = useGetMessages();

  const containerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const isInitialRef = useRef(true);

  useListenMessages();

  useEffect(() => {
    if (!messages.length) return;

    if (isInitialRef.current) {
      lastMessageRef.current.scrollIntoView();
      isInitialRef.current = false;
      return;
    }
    const container = containerRef.current;

    const lastMessage = messages[messages.length - 1];
    const isLastSendByMe = lastMessage.senderId === authUser._id;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      100;

    if (isLastSendByMe || isNearBottom) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (loading)
    return (
      <div className="px-4 flex-1 overflow-auto">
        {[...Array(3)].map((_, idx) => (
          <MessageSkeleton key={idx} />
        ))}
      </div>
    );

  return (
    <div className="px-4 flex-1 overflow-auto" ref={containerRef}>
      {messages.length === 0 ? (
        <p className="text-center">Send a message to start the conversation</p>
      ) : (
        <>
          {messages.map((message) => (
            <div key={message._id}>
              <Message message={message} />
            </div>
          ))}

          <div ref={lastMessageRef} />
        </>
      )}
    </div>
  );
}

export default Messages;
