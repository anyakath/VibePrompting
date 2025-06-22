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
    <div className="p-6 border-b border-border/50 bg-card/30">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-foreground">Add Child Node</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Add a new child to:{" "}
          <span className="font-medium text-primary">{selectedNode}</span>
        </p>
      </div>
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isProcessing ? "Loading..." : "Enter node name..."}
          className="flex-1 bg-background/50 border-border/50 focus:border-ring focus:ring-ring/20 transition-all duration-200"
          disabled={isProcessing}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-200 hover:shadow-md"
          disabled={!inputValue.trim() || isProcessing}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
