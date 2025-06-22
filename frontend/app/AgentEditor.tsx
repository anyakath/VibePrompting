"use client";

import { FileText } from "lucide-react";
import { motion } from "framer-motion";

interface AgentEditorProps {
  selectedNode: string;
  nodeJson?: object;
}

const AgentEditor = ({ selectedNode, nodeJson }: AgentEditorProps) => {
  return (
    <motion.div
      className="p-6 bg-background/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">
          {selectedNode} - JSON Data
        </h2>
        <div className="flex-1" />
        <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
          JSON
        </div>
      </div>
      <div className="rounded-lg border border-border/50 bg-card/50 p-6 overflow-x-auto">
        <pre className="text-sm leading-relaxed whitespace-pre-wrap">
          <code className="text-muted-foreground font-mono">
            {JSON.stringify(nodeJson, null, 2)}
          </code>
        </pre>
      </div>
    </motion.div>
  );
};

export default AgentEditor;
