import { useRef, useEffect, ReactNode } from "react";

interface ChatMessage {
  sender: "bot" | "user";
  text: ReactNode;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
}

function ChatMessages({ messages }: ChatMessagesProps) {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="relative h-64 overflow-y-auto hide-scrollbar p-4 mb-4"
    >
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-2 flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <p
            className={`p-2 rounded-md max-w-[75%] ${
              message.sender === "user"
                ? "bg-teal-600 dark:bg-gray-600 text-white"
                : "bg-white/20 dark:bg-gray-700/50 text-gray-800 dark:text-white"
            }`}
          >
            {message.text}
          </p>
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;
