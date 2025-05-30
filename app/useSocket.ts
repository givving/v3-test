// hooks/useWebSocket.ts
import { useEffect, useRef, useState, useCallback } from "react";

export const useSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>();
  const websocketAddressV2 = "wss://gbgb.rd37.com:1880/gbgb/test";

  const connect = useCallback(() => {
    if (socketRef.current) {
      return;
    }

    const socket = new WebSocket(websocketAddressV2);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      // console.log("Message received:", event.data);
      setMessages((prev) => [...prev, event.data]);
      setMessage(event.data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    socket.onclose = () => {
      console.warn("WebSocket disconnected, retrying...");
      setIsConnected(false);
      socketRef.current = null;
      // Auto-reconnect after 2 seconds
      setTimeout(() => {
        connect();
      }, 2000);
    };
  }, [websocketAddressV2]);

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.warn("Cannot send message, socket not connected");
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.close();
    };
  }, [connect]);

  return { isConnected, message, messages, sendMessage };
};
