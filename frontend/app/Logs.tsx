"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelRightClose } from "lucide-react";
import { Message } from "@/lib/types";

interface LogsProps {
  selectedNode: string;
  toggleLogs: () => void;
  messages: Message[];
}

const Logs: React.FC<LogsProps> = ({ selectedNode, toggleLogs, messages }) => {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLogs}
            className="cursor-pointer -ml-2"
          >
            <PanelRightClose className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">Logs</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Selected: {selectedNode}</p>
      </div>

      <>
        <ScrollArea className="flex-1 p-4 min-h-0">
          <div className="flex flex-col gap-2">
            {messages.map((message) => (
              <div key={message.id} className="italic text-gray-700 text-sm">
                {message.content}
              </div>
            ))}
          </div>
        </ScrollArea>
      </>
    </div>
  );
};

export default Logs;
