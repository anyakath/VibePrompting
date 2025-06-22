"use client";

import React, { useState, useRef } from "react";
import Logs from "@/app/Logs";
import History from "@/app/History";
import { Message, OrgChartNode } from "@/lib/types";
import AgentEditor from "@/app/AgentEditor";
import { Button } from "@/components/ui/button";
import { addChildToNodeByName, findNodeByName } from "@/lib/utils";
import ChatInput from "@/app/ChatInput";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  ImperativePanelHandle,
} from "react-resizable-panels";
import AgentContent from "@/lib/agent.json";

export default function Home() {
  const [orgChart, setOrgChart] = useState<OrgChartNode>({
    name: "Booking Agent V1",
    children: [],
  });

  const [selectedNode, setSelectedNode] = useState<string>("Booking Agent V1");
  const [isLogsOpen, setIsLogsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const logsPanelRef = useRef<ImperativePanelHandle>(null);

  const expandLogs = () => {
    logsPanelRef.current?.expand();
  };

  const collapseLogs = () => {
    logsPanelRef.current?.collapse();
  };

  const handleAddNode = async (inputValue: string) => {
    if (!inputValue.trim()) return;

    setIsProcessing(true);

    // Create a Blob from the JSON data
    const blob = new Blob([JSON.stringify(AgentContent)], {
      type: "application/json",
    });

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("json_file", blob, "agent.json");
    formData.append("prompt", inputValue.trim());

    try {
      // Make API call to Flask backend with file upload
      const response = await fetch("http://localhost:5000/process_json", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process prompt");
      }

      // Check if this is the first child before updating the chart
      const targetNode = findNodeByName(orgChart, selectedNode);
      const isFirstChild = targetNode && targetNode.children.length === 0;

      // Add a message for the successful API call
      const messageContent = isFirstChild
        ? `Child node "${inputValue.trim()}" added`
        : `Branch created and child node "${inputValue.trim()}" added`;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: messageContent,
          sender: "system",
        },
      ]);

      setOrgChart((prevChart) => {
        return addChildToNodeByName(prevChart, selectedNode, inputValue.trim());
      });

      setSelectedNode(inputValue.trim());
    } catch (error) {
      console.error("Error processing prompt:", error);

      // Add error message to logs
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `Error processing prompt: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          sender: "system",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
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
                  isProcessing={isProcessing}
                />
                <div className="flex-1 min-h-0">
                  <AgentEditor />
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
          className="absolute top-4 right-4 z-10 bg-white text-black border border-gray-300 hover:bg-gray-100 rounded-md px-4 py-2 cursor-pointer"
        >
          Logs
        </Button>
      )}
    </div>
  );
}
