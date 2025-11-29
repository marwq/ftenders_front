import { useState, useEffect, useRef, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  type: 'text' | 'tool_use' | 'end';
  text?: string;
  tool_name?: string;
  tool_input?: any;
  timestamp: number;
}

const WS_URL = import.meta.env.VITE_API_URL?.replace('http', 'ws') || 'ws://localhost:8001';

export const useChat = (selectedTenderIds: string[]) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnectRef = useRef(true);
  const pendingMessagesRef = useRef<Array<{ text: string; mentioned?: string[] }>>([]);
  const selectedTenderIdsRef = useRef(selectedTenderIds);

  useEffect(() => {
    selectedTenderIdsRef.current = selectedTenderIds;
  }, [selectedTenderIds]);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`${WS_URL}/ai/ws`);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        // flush queued messages
        if (pendingMessagesRef.current.length > 0) {
          pendingMessagesRef.current.forEach((msg) => {
            const payload = {
              text: msg.text,
              mentioned_tenders: msg.mentioned ?? selectedTenderIdsRef.current,
            };
            ws.send(JSON.stringify(payload));
          });
          pendingMessagesRef.current = [];
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'end') {
            setIsLoading(false);
            return;
          }

          if (data.type === 'text') {
            const newMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              type: 'text',
              text: data.text,
              timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, newMessage]);
          } else if (data.type === 'tool_use') {
            const newMessage: Message = {
              id: data.id,
              role: 'assistant',
              type: 'tool_use',
              tool_name: data.name,
              tool_input: data.input,
              timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, newMessage]);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        if (shouldReconnectRef.current) {
          // Reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    pendingMessagesRef.current = [];
    shouldReconnectRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    shouldReconnectRef.current = true;
    connect();
  }, [connect]);

  const sendMessage = useCallback((text: string, mentionedIdsOverride?: string[]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      type: 'text',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const payload = {
      text,
      mentioned_tenders: mentionedIdsOverride || selectedTenderIdsRef.current,
    };

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      pendingMessagesRef.current.push({ text, mentioned: payload.mentioned_tenders });
      return;
    }

    wsRef.current.send(JSON.stringify(payload));
  }, []);

  return {
    messages,
    isConnected,
    isLoading,
    sendMessage,
    resetChat,
  };
};

export type ChatState = ReturnType<typeof useChat>;
