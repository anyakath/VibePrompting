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

    setOrgChart((prevChart) => {
      const targetNode = findNodeByName(prevChart, selectedNode);
      if (targetNode && targetNode.children.length === 0) {
        newMessages.push({
          id: Date.now().toString(),
          content: "Branch created",
          sender: "system",
        });
      }

      newMessages.push({
        id: (Date.now() + 1).toString(),
        content: `Child node "${inputValue.trim()}" added`,
        sender: "system",
      });

      return addChildToNodeByName(prevChart, selectedNode, inputValue.trim());
    });

    setMessages((prev) => [...prev, ...newMessages]);
    setSelectedNode(inputValue.trim());
  };

  return (
    <div className="h-screen w-full relative">
      <PanelGroup direction="horizontal">
        <Panel>
          <PanelGroup direction="vertical">
            <Panel>
              <div className="overflow-auto h-full">
                <History
                  orgChart={orgChart}
                  selectedNode={selectedNode}
                  setSelectedNode={setSelectedNode}
                  isLogsOpen={isLogsOpen}
                />
              </div>
            </Panel>
            <PanelResizeHandle className="h-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
            <Panel defaultSize={40} minSize={20} collapsible>
              <div className="flex flex-col h-full">
                <ChatInput
                  selectedNode={selectedNode}
                  onSendMessage={handleAddNode}
                />
                <div className="flex-1 min-h-0">
                  <PromptEditor />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="w-px bg-gray-300" />
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
          className="absolute top-4 right-0 z-10 bg-white text-black border border-gray-300 hover:bg-gray-100 rounded-l-md rounded-r-none px-4 py-2 h-auto cursor-pointer"
        >
          Logs
        </Button>
      )}
    </div>
  );
}
