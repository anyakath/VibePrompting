"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelRightClose, Activity } from "lucide-react";
import { Message, OrgChartNode } from "@/lib/types";
import { findNodeByName } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogsProps {
  orgChart: OrgChartNode;
  selectedNode: string;
  toggleLogs: () => void;
  messages: Message[];
}

const Logs: React.FC<LogsProps> = ({
  orgChart,
  selectedNode,
  toggleLogs,
  messages,
}) => {
  const selectedNodeData = findNodeByName(orgChart, selectedNode);
  const nodeId = selectedNodeData?.id || "No ID";

  return (
    <motion.div
      className="w-full flex flex-col h-full bg-card/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="p-4 border-b border-border/50 bg-card/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold text-foreground">
              Activity Logs
            </h2>
          </div>
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLogs}
              className="h-8 w-8 items-center hover:bg-green-500/10 hover:text-green-500 transition-colors duration-200"
            >
              <PanelRightClose className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Selected:</span>
            <span className="font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
              {selectedNode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">ID:</span>
            <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
              {nodeId}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 min-h-0 scrollbar-thin flex">
        <div className="flex flex-col gap-3 w-full">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center py-8 max-w-[250px] mt-[30vh]">
                <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-base text-muted-foreground mb-2">
                  No activity yet
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Actions will appear here as you interact with the system
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start gap-2 p-2.5 bg-background/50 rounded border border-border/30 hover:bg-background/70 transition-colors duration-200"
              >
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">
                    {message.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(parseInt(message.id)).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default Logs;
