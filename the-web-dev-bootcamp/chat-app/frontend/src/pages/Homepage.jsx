import React from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

function Homepage() {
  const {
    users,
    isUsersLoading,
    selectedUser,
    isMessagesLoading,
    messages,
    getUsers,
    getMessages,
  } = useChatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex h-full items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100%-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
