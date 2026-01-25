import { useState, useCallback, useRef } from "react";
import { api, buildUrl } from "@shared/routes";
import { useQueryClient } from "@tanstack/react-query";

interface StreamOptions {
  onStart?: () => void;
  onToken?: (token: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
}

export function useChatStream(conversationId: number) {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  const sendMessage = useCallback(async (content: string, options?: StreamOptions) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsStreaming(true);
      options?.onStart?.();

      const url = buildUrl(api.conversations.sendMessage.path, { id: conversationId });
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
        signal: abortControllerRef.current.signal,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.content) {
                fullContent += data.content;
                options?.onToken?.(data.content);
              }
              
              if (data.done) {
                // Stream finished
              }
              
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              console.warn("Failed to parse SSE line:", line, e);
            }
          }
        }
      }

      options?.onComplete?.(fullContent);
      // Invalidate queries to sync with backend DB state
      queryClient.invalidateQueries({ queryKey: [api.conversations.get.path, conversationId] });
      queryClient.invalidateQueries({ queryKey: [api.conversations.list.path] });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Ignore aborts
      }
      console.error("Streaming error:", error);
      options?.onError?.(error instanceof Error ? error : new Error("Unknown streaming error"));
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [conversationId, queryClient]);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  return {
    sendMessage,
    stopStream,
    isStreaming,
  };
}
