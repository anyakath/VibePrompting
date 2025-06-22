"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  selectedNode: string;
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  selectedNode,
  onSendMessage,
  isProcessing = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="p-4 border-t">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            isProcessing ? "Processing..." : `Add child to ${selectedNode}...`
          }
          className="flex-1"
          disabled={isProcessing}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-black text-white cursor-pointer"
          disabled={isProcessing}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
