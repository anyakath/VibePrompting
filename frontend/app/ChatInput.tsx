"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  isProcessing?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  selectedNode,
  onSendMessage,
  isProcessing = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="p-6 bg-transparent" style={{ backgroundColor: "transparent !important", background: "transparent !important" }}>
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
          placeholder={isProcessing ? "Loading..." : "Enter node name..."}
          className="flex-1 border-border/50 focus:border-ring focus:ring-ring/20 transition-all duration-200"
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
      <div className="mt-1 ml-1 flex justify-start">
        <Select value={selectedOption} onValueChange={setSelectedOption}>
          <SelectTrigger className="w-48 h-8 text-xs border-border/30 cursor-pointer">
            <SelectValue placeholder="Edit Everything..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="everything" className="cursor-pointer">Edit Everything</SelectItem>
            <SelectItem value="search_destination" className="cursor-pointer">Edit Search Destination Tool</SelectItem>
            <SelectItem value="booking_tool" className="cursor-pointer">Edit Booking Tool</SelectItem>
            <SelectItem value="payment_tool" className="cursor-pointer">Edit Payment Tool</SelectItem>
            <SelectItem value="agent_1" className="cursor-pointer">Edit Agent 1</SelectItem>
            <SelectItem value="agent_2" className="cursor-pointer">Edit Agent 2</SelectItem>
            <SelectItem value="agent_3" className="cursor-pointer">Edit Agent 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ChatInput;
