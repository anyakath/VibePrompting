"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { Message, OrgChartNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { appendChildToOrgChart, addChildToNodeByName } from "@/lib/utils";

interface ChatProps {
  setOrgChart: React.Dispatch<React.SetStateAction<OrgChartNode>>;
  selectedNode: string | null;
}

const Chat: React.FC<ChatProps> = ({ setOrgChart, selectedNode }) => {
  // TODO: Load this from backend
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Welcome to the tree visualization! Click on nodes to select them, then type a name here to add a child node.",
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

    // Add the new node to the org chart
    if (selectedNode) {
      // Add child to the selected node
      setOrgChart((prevChart) =>
        addChildToNodeByName(prevChart, selectedNode, inputValue.trim())
      );

      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Added "${inputValue.trim()}" as a child of "${selectedNode}"`,
        sender: "system",
      };
      setMessages((prev) => [...prev, systemMessage]);
    } else {
      // Fallback to adding to root if no node is selected
      setOrgChart((prevChart) =>
        appendChildToOrgChart(prevChart, inputValue.trim())
      );

      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Added "${inputValue.trim()}" to the root level`,
        sender: "system",
      };
      setMessages((prev) => [...prev, systemMessage]);
    }

    setInputValue("");
  };

  return (
    <div className="w-full border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Fix your agent</h2>
        {selectedNode && (
          <p className="text-sm text-gray-600 mt-1">Selected: {selectedNode}</p>
        )}
      </div>

      <ScrollArea className="flex-1 p-4 min-h-0">
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
            placeholder={
              selectedNode
                ? `Add child to ${selectedNode}...`
                : "Type a name to add to root..."
            }
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
