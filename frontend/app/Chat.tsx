"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

const Chat = () => {
  // TODO: Load this from backend
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Welcome to the tree visualization! Click on nodes to navigate or create new ones.",
      sender: "system",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  // TODO: Connect this to backend
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    // We probably won't need a timeout when this is linked to backend lol
    setTimeout(() => {
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `You said: ${inputValue}. Creating a new node...`,
        sender: "system",
      };
      setMessages((prev) => [...prev, systemMessage]);
    }, 1000);
  };

  return (
    <div className="w-full border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Fix your agent</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "p-3 rounded-lg max-w-[90%]",
                message.sender === "user"
                  ? "bg-black text-white ml-auto"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              {message.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What do you want to change?"
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-black text-white">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
