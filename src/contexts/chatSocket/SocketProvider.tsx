import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import {
  onRecieveUnReadChat,
  onRemoveUnReadChat,
  onReceiveWhatsAppMessage,
  hideWhatsAppPopup,
} from "@/redux/slice/chatSlice";

interface ISocketProvider {
  children: any;
}

export const SocketProvider = (props: ISocketProvider) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const baseUrl: any = process.env.BASE_URL;
  console.log("user", user);
  // Configure socket with authentication and query parameters
  const socketConnection = io(baseUrl, {
    query: {
      // Authentication data
      token: user?.access_token,
      agent_uuid: user?.agent_detail?.uuid,
      browserToken: user?.agent_detail?.browserToken,
      // Additional query parameters
      user_uuid: user?.agent_detail?.uuid,
      user_id: user?.id,
      agent_id: user?.agent_detail?.id,
    },
    // Authentication via headers (alternative approach)
    auth: {
      token: user?.access_token,
      browserToken: user?.agent_detail?.browserToken,
    },
    // Connection options
    transports: ["websocket", "polling"], // Force websocket transport
    autoConnect: true, // Auto connect on instantiation
    reconnection: true, // Enable reconnection
    reconnectionAttempts: 5, // Number of reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts
    timeout: 20000, // Connection timeout
  });

  useEffect(() => {
    let browserToken = user?.agent_detail?.browserToken;

    // Listen for 'connect' event
    socketConnection.on("connect", () => {
      console.log("Connected to server!");
    });

    // Listen for 'disconnect' event
    socketConnection.on("disconnect", () => {
      console.log("Disconnected from server!");
    });
    socketConnection.on("whatsapp_message", (data) => {
      console.log("Received WhatsApp message from server:", data);
      // Trigger WhatsApp popup if messageId is provided
      if (data.messageId) {
        dispatch(onReceiveWhatsAppMessage(data));
      }
    });

    socketConnection.on("ui:closePopup", (data) => {
      console.log("Popup:", data);
      if (data?.reason === "accepted") {
        dispatch(hideWhatsAppPopup());
      }
      // Trigger WhatsApp popup if messageId is provided
    });
    // Listen for 'browser_token-message' event
    socketConnection.on(browserToken + "-message", (data) => {
      console.log("Received data from server:", data);
      dispatch(onRecieveUnReadChat(data));
    });
    // this.server.to(socketId).emit("whatsapp_message_live", payload);
    socketConnection.on("whatsapp_message_live", (data) => {
      console.log("Received data from server live", data);
      dispatch(onRecieveUnReadChat(data));
    });

    socketConnection.on(browserToken + "-message-remove", (data) => {
      console.log("Received data from server to remove unread message:", data);
      dispatch(onRemoveUnReadChat(data));
    });

    // Clean up function to disconnect socket on component unmount
    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
  }, []);

  return <div>{props.children}</div>;
};
