import { useRef, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal} from "react";

// @ts-ignore
function ChatMessages({messages}) {
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Whenever messages changes, scroll to the bottom
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    return (
        <div
            ref={chatContainerRef}
            className="relative h-64 overflow-y-auto hide-scrollbar p-4 mb-4"
        >
            {messages.map((message: {
                sender: string;
                text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
            }, index: Key | null | undefined) => (
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

      {/* This div stays at the bottom of the messages list */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;
