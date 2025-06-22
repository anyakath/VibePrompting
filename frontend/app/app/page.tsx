"use client";

import React, { useState, useRef } from "react";
import Logs from "@/app/Logs";
import History from "@/app/History";
import { Message, OrgChartNode } from "@/lib/types";
import AgentEditor from "@/app/AgentEditor";
import { Button } from "@/components/ui/button";
import { addChildToNodeByName, findNodeByName, generateNodeId } from "@/lib/utils";
import ChatInput from "@/app/ChatInput";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  ImperativePanelHandle,
} from "react-resizable-panels";
import AgentContent from "@/lib/agent.json";
import { Home, Sparkles } from "lucide-react";

export default function AppPage() {
  const [orgChart, setOrgChart] = useState<OrgChartNode>({
    id: "root_node",
    name: "Booking Agent V1",
    children: [],
    jsonData: AgentContent,
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

    // Find the selected node to get its JSON data
    const selectedNodeData = findNodeByName(orgChart, selectedNode);
    if (!selectedNodeData) {
      console.error("Selected node not found");
      setIsProcessing(false);
      return;
    }

    // Use the selected node's JSON data as the base, or fall back to AgentContent
    const baseJsonData = selectedNodeData.jsonData || AgentContent;

    // Create a Blob from the JSON data
    const blob = new Blob([JSON.stringify(baseJsonData)], {
      type: "application/json",
    });

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("json_file", blob, "agent.json");
    formData.append("prompt", inputValue.trim());

    try {
      // Make API call to Flask backend with file upload
      const response = await fetch("http://localhost:5000/process_json/1", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process prompt");
      }

      // Generate unique ID for the new node
      const newNodeId = generateNodeId();

      // Check if this is the first child before updating the chart
      const targetNode = findNodeByName(orgChart, selectedNode);
      const isFirstChild = targetNode && targetNode.children.length === 0;

      // Add a message for the successful API call
      const messageContent = isFirstChild
        ? `Child node "${inputValue.trim()}" added with ID: ${newNodeId}`
        : `Branch created and child node "${inputValue.trim()}" added with ID: ${newNodeId}`;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: messageContent,
          sender: "system",
        },
      ]);

      // Store the generated JSON data from the API response
      const generatedJsonData = result.json_data || result;

      setOrgChart((prevChart) => {
        return addChildToNodeByName(
          prevChart, 
          selectedNode, 
          inputValue.trim(), 
          newNodeId,
          undefined,
          generatedJsonData
        );
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
    <div className="h-screen w-full relative bg-background">
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6" />
            <span className="font-semibold text-lg">VibePrompting</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/'}
            className="flex items-center space-x-0"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Button>
        </div>
      </div>

      {/* Main Content with top padding for header */}
      <div className="pt-12 h-full">
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
              <div>
                <ChatInput
                  selectedNode={selectedNode}
                  onSendMessage={handleAddNode}
                  isProcessing={isProcessing}
                />
              </div>
              <PanelResizeHandle className="h-1 bg-border hover:bg-ring/50 transition-colors duration-200 group">
                <div className="w-8 h-1 bg-muted-foreground/20 rounded-full mx-auto group-hover:bg-muted-foreground/40 transition-colors duration-200" />
              </PanelResizeHandle>
              <Panel defaultSize={35} minSize={20} collapsible>
                <div className="h-full bg-card/50">
                  <div className="h-full overflow-auto scrollbar-thin">
                    <AgentEditor orgChart={orgChart} selectedNode={selectedNode} />
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
              orgChart={orgChart}
              selectedNode={selectedNode}
              toggleLogs={collapseLogs}
              messages={messages}
            />
          </Panel>
        </PanelGroup>
        {!isLogsOpen && (
          <Button
            onClick={expandLogs}
            className="absolute top-16 right-4 z-10 bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground rounded-lg px-4 py-2 h-auto cursor-pointer shadow-sm transition-all duration-200 hover:shadow-md"
          >
            Logs
          </Button>
        )}
      </div>
    </div>
  );
} 