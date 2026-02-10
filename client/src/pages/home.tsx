import { useEffect, useRef, useState } from "react";
import { useRoute } from "wouter";
import { Sidebar } from "@/components/layout/sidebar";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useConversation } from "@/hooks/use-conversations";
import { useChatStream } from "@/hooks/use-chat-stream";
import { Send, StopCircle, Bot, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function HomePage() {
  const [match, params] = useRoute("/chat/:id");
  const conversationId = params?.id ? parseInt(params.id) : null;
  const { t } = useLanguage();

  const { data: conversation, isLoading } = useConversation(conversationId);
  const { sendMessage, stopStream, isStreaming } = useChatStream(conversationId || 0);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Local state for optimistic updates and streaming
  const [messages, setMessages] = useState<any[]>([]);

  // Sync with server data when loaded or changed
  useEffect(() => {
    if (conversation?.messages) {
      setMessages(conversation.messages);
    }
  }, [conversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !conversationId) return;

    const userMessage = { role: "user", content: input };
    const tempAiMessage = { role: "assistant", content: "", isStreaming: true };

    setMessages(prev => [...prev, userMessage, tempAiMessage]);
    setInput("");

    await sendMessage(userMessage.content, {
      onToken: (token) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === "assistant") {
            lastMsg.content += token;
          }
          return newMessages;
        });
      },
      onComplete: () => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          lastMsg.isStreaming = false;
          return newMessages;
        });
      },
      onError: () => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          lastMsg.content += "\n\n*[Error generating response]*";
          lastMsg.isStreaming = false;
          return newMessages;
        });
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!conversationId) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-6">
          <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 animate-in zoom-in duration-500">
            <Bot className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight">{t("home.welcome")}</h1>
          <p className="text-muted-foreground max-w-md text-lg">
            {t("home.welcomeSubtitle")}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col relative h-full w-full">
        {/* Header - Mobile only mostly */}
        <header className="h-14 border-b flex items-center px-4 md:hidden shrink-0">
          <span className="ml-12 font-semibold truncate">
            {conversation?.title || t("home.chat")}
          </span>
        </header>

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
              <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
              <p>{t("home.noMessages")}</p>
            </div>
          ) : (
            <div className="flex flex-col pb-4">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  isStreaming={msg.isStreaming}
                />
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="shrink-0 p-4 bg-background/80 backdrop-blur-sm border-t">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-secondary/50 rounded-2xl border shadow-sm p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("home.messagePlaceholder")}
                className="min-h-[50px] max-h-[200px] w-full resize-none border-0 bg-transparent focus-visible:ring-0 px-4 py-3 text-base scrollbar-none"
                rows={1}
              />
              <div className="pb-2 pr-2">
                {isStreaming ? (
                  <Button
                    type="button"
                    size="icon"
                    onClick={stopStream}
                    className="h-10 w-10 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    <StopCircle className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    className="h-10 w-10 rounded-full transition-all duration-200"
                  >
                    <Send className="h-5 w-5 ml-0.5" />
                  </Button>
                )}
              </div>
            </form>
            <div className="text-center mt-2">
              <p className="text-xs text-muted-foreground">
                {t("home.disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
