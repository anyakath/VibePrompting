"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatInputProps {
  selectedNode: string;
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  selectedNode,
  onSendMessage,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="p-6 border-b border-border/50 bg-card/30">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-foreground">Generate New Prompts</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Build off of: <span className="font-medium text-primary">{selectedNode}</span>
        </p>
      </div>
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter node name..."
          className="flex-1 bg-background/50 border-border/50 focus:border-ring focus:ring-ring/20 transition-all duration-200"
        />
        <Button
          type="submit"
          size="icon"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-200 hover:shadow-md"
          disabled={!inputValue.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
      <div className="mt-1 ml-1 flex justify-start">
        <Select value={selectedOption} onValueChange={setSelectedOption}>
          <SelectTrigger className="w-48 h-8 text-xs bg-background/30 border-border/30">
            <SelectValue placeholder="Edit Everything..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="everything">Edit Everything</SelectItem>
            <SelectItem value="search_destination">Edit Search Destination Tool</SelectItem>
            <SelectItem value="booking_tool">Edit Booking Tool</SelectItem>
            <SelectItem value="payment_tool">Edit Payment Tool</SelectItem>
            <SelectItem value="agent_1">Edit Agent 1</SelectItem>
            <SelectItem value="agent_2">Edit Agent 2</SelectItem>
            <SelectItem value="agent_3">Edit Agent 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ChatInput; 