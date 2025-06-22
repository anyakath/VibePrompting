"use client";

import React, { useState, useRef } from "react";
import Logs from "@/app/Logs";
import History from "@/app/History";
import { Message, OrgChartNode } from "@/lib/types";
import PromptEditor from "./PromptEditor";
import { Button } from "@/components/ui/button";
import { addChildToNodeByName, findNodeByName } from "@/lib/utils";
import ChatInput from "./ChatInput";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  ImperativePanelHandle,
} from "react-resizable-panels";

export default function Home() {
  const [orgChart, setOrgChart] = useState<OrgChartNode>({
    name: "CEO",
    children: [
      {
        name: "Manager",
        attributes: {
          Department: "Production",
          bread: "Yes",
        },
        children: [],
      },
      {
        name: "Another Manager",
        attributes: {
          Department: "Production",
          bread: "Yes",
        },
        children: [],
      },
    ],
  });

  const [selectedNode, setSelectedNode] = useState<string>("CEO");
  const [isLogsOpen, setIsLogsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const logsPanelRef = useRef<ImperativePanelHandle>(null);

  const expandLogs = () => {
    logsPanelRef.current?.expand();
  };

  const collapseLogs = () => {
    logsPanelRef.current?.collapse();
  };

  const handleAddNode = (inputValue: string) => {
    if (!inputValue.trim()) return;

    const newMessages: Message[] = [];
    
    // Check if we need to create a branch message before updating the chart
    const targetNode = findNodeByName(orgChart, selectedNode);
    if (targetNode && targetNode.children.length > 0) {
      newMessages.push({
        id: Date.now().toString(),
        content: `Branch created under "${selectedNode}"`,
        sender: "system",
      });
    }

    newMessages.push({
      id: (Date.now() + 1).toString(),
      content: `Child node "${inputValue.trim()}" added to "${selectedNode}"`,
      sender: "system",
    });

    setOrgChart((prevChart) => {
      return addChildToNodeByName(prevChart, selectedNode, inputValue.trim());
    });

    setMessages((prev) => [...prev, ...newMessages]);
    setSelectedNode(inputValue.trim());
  };

  return (
    <div className="h-screen w-full relative bg-background">
      <PanelGroup direction="horizontal" className="h-full">
        <Panel>
          <PanelGroup direction="vertical" className="h-full">
            <Panel>
              <div className="overflow-auto h-full scrollbar-thin">
                <History
                  orgChart={orgChart}
                  selectedNode={selectedNode}
                  setSelectedNode={setSelectedNode}
                  isLogsOpen={isLogsOpen}
                />
              </div>
            </Panel>
            <PanelResizeHandle className="h-1 bg-border hover:bg-ring/50 transition-colors duration-200 group">
              <div className="w-8 h-1 bg-muted-foreground/20 rounded-full mx-auto group-hover:bg-muted-foreground/40 transition-colors duration-200" />
            </PanelResizeHandle>
            <Panel defaultSize={40} minSize={20} collapsible>
              <div className="flex flex-col h-full bg-card/50">
                <ChatInput
                  selectedNode={selectedNode}
                  onSendMessage={handleAddNode}
                />
                <div className="flex-1 min-h-0 overflow-auto scrollbar-thin">
                  <PromptEditor />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="w-1 bg-border hover:bg-ring/50 transition-colors duration-200 group flex items-center justify-center">
          <div className="h-8 w-1 bg-muted-foreground/20 rounded-full group-hover:bg-muted-foreground/40 transition-colors duration-200" />
        </PanelResizeHandle>
        <Panel
          ref={logsPanelRef}
          defaultSize={25}
          collapsible
          collapsedSize={0}
          minSize={15}
          maxSize={30}
          onCollapse={() => setIsLogsOpen(false)}
          onExpand={() => setIsLogsOpen(true)}
          order={2}
        >
          <Logs
            selectedNode={selectedNode}
            toggleLogs={collapseLogs}
            messages={messages}
          />
        </Panel>
      </PanelGroup>
      {!isLogsOpen && (
        <Button
          onClick={expandLogs}
          className="absolute top-4 right-0 z-10 bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground rounded-l-lg rounded-r-none px-4 py-2 h-auto cursor-pointer shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Logs
        </Button>
      )}
    </div>
  );
}
