"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import AgentContent from "@/lib/agent.json";

const AgentEditor = () => {
  return (
    <div className="p-4 border-t border-gray-200 h-full flex flex-col">
      <h2 className="text-sm font-semibold mb-2">agent.json</h2>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full rounded-md border bg-gray-50">
          <pre className="p-4 text-sm">
            <code>{JSON.stringify(AgentContent, null, 2)}</code>
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AgentEditor;
