import React, { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

function useListenMessages() {
  const { socket } = useSocketContext();
  const { receiveMessage, selectedConversation } = useConversation();

  console.log(selectedConversation);
  useEffect(() => {
    console.log("socket on");
    socket?.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedConversation._id) {
        return;
      }

      const sound = new Audio(notificationSound);
      sound.play();
      newMessage.shouldShake = true;
      receiveMessage(newMessage);
    });

    return () => socket.off("newMessage");
  }, [socket, receiveMessage]);

  return null;
}

export default useListenMessages;
