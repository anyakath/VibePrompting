"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { OrgChartNode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TreeNodeDatum } from "react-d3-tree";
import { cn, truncateText } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

interface HistoryProps {
  orgChart: OrgChartNode;
  selectedNode: string;
  setSelectedNode: React.Dispatch<React.SetStateAction<string>>;
  isLogsOpen: boolean;
}

interface CustomNodeElementProps {
  nodeDatum: TreeNodeDatum;
  onNodeClick: () => void;
  selectedNode: string;
}

const renderCustomNode = ({
  nodeDatum,
  onNodeClick,
  selectedNode,
}: CustomNodeElementProps) => {
  const isSelected = nodeDatum.name === selectedNode;

  return (
    <g>
      {/* Glow effect for selected node */}
      {isSelected && (
        <circle
          r={22}
          fill="url(#selectedGlow)"
          opacity="0.3"
          filter="url(#glow)"
        />
      )}

      {/* Node label positioned above the node */}
      <text
        strokeWidth="0"
        x="0"
        y="-35"
        textAnchor="middle"
        className={cn(
          "text-sm font-medium transition-all duration-300",
          isSelected ? "fill-foreground font-semibold" : "fill-muted-foreground"
        )}
        style={{
          textShadow: isSelected ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
          fontSize: isSelected ? "14px" : "13px",
        }}
      >
        {truncateText(nodeDatum.name, 20)}
      </text>

      {/* Main node circle with gradient */}
      <circle
        r={16}
        fill={isSelected ? "url(#selectedGradient)" : "url(#defaultGradient)"}
        strokeWidth={isSelected ? 3 : 2}
        stroke={isSelected ? "url(#selectedStroke)" : "url(#defaultStroke)"}
        onClick={onNodeClick}
        className="cursor-pointer transition-all duration-300 hover:r-18"
        filter={isSelected ? "url(#shadow)" : "none"}
      />

      {/* Hover effect indicator */}
      <circle
        r={16}
        fill="transparent"
        stroke="transparent"
        onClick={onNodeClick}
        className="cursor-pointer"
        onMouseEnter={(e) => {
          e.currentTarget.style.stroke = "url(#hoverStroke)";
          e.currentTarget.style.strokeWidth = "2";
          e.currentTarget.style.opacity = "0.4";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.stroke = "transparent";
          e.currentTarget.style.strokeWidth = "0";
          e.currentTarget.style.opacity = "0";
        }}
      />
    </g>
  );
};

const History: React.FC<HistoryProps> = ({
  orgChart,
  selectedNode,
  setSelectedNode,
  isLogsOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [trainQuery, setTrainQuery] = useState("");
  const [trainIterations, setTrainIterations] = useState("10");
  const [isTraining, setIsTraining] = useState(false);

  const handleNodeClick = (nodeData: TreeNodeDatum) => {
    setSelectedNode(nodeData.name);
  };

  const checkIfServerReady = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

      await fetch("http://localhost:8000", {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true;
    } catch {
      return false;
    }
  };

  // Check if agent is running on component mount
  React.useEffect(() => {
    const checkAgentStatus = async () => {
      const isRunning = await checkIfServerReady();
      setIsAgentRunning(isRunning);
    };

    checkAgentStatus();
  }, []);

  const waitForServer = async (): Promise<void> => {
    const maxAttempts = 30; // 30 seconds max
    let attempts = 0;

    while (attempts < maxAttempts) {
      const isReady = await checkIfServerReady();
      if (isReady) {
        setIsAgentRunning(true);
        return;
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    }

    throw new Error("Server not ready after 30 seconds");
  };

  const handleRunAgent = async () => {
    if (isLoading) return; // Prevent multiple simultaneous requests

    // If agent is already running, just open the interface
    if (isAgentRunning) {
      window.open("http://localhost:8000", "_blank");
      return;
    }

    setIsLoading(true);

    try {
      // Trigger ADK web restart
      await fetch("http://localhost:5000/retrigger_adk_web", {
        method: "POST",
      });

      // Wait for server to be ready
      await waitForServer();

      // Open localhost:8000 in a new tab
      window.open("http://localhost:8000", "_blank");
    } catch (error) {
      console.error("Error starting agent:", error);
      // You could show an error message here if needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainAgent = async () => {
    if (isTraining || !trainQuery.trim() || !trainIterations) return;
    
    setIsTraining(true);
    
    try {
      // Here you would implement the actual training logic
      // For now, we'll just simulate a training process
      console.log(`Training agent with query: "${trainQuery}" for ${trainIterations} iterations`);
      
      // Simulate training delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // You could add actual API call here:
      // const response = await fetch("http://localhost:5000/train_agent", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ query: trainQuery, iterations: parseInt(trainIterations) })
      // });
      
      console.log("Training completed successfully");
    } catch (error) {
      console.error("Error training agent:", error);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Enhanced header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
        <h2 className="text-lg mt-[-5px] font-semibold text-gray-900 pointer-events-auto">
          Booking Agent
        </h2>
        
        <div className={cn("flex flex-col space-y-4 pointer-events-auto", !isLogsOpen && "mr-16")}>
          <Button
            className={cn(
              "text-white",
              isAgentRunning
                ? "bg-green-600 hover:bg-green-700"
                : "bg-black hover:bg-gray-900"
            )}
            onClick={handleRunAgent}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Starting...
              </div>
            ) : isAgentRunning ? (
              "Agent Running"
            ) : (
              "Run Agent"
            )}
          </Button>
          
          {/* Train Your Agent Section */}
          <div className="p-4 bg-white/90 border border-gray-200 rounded-lg w-64">
            <h3 className="text-md font-bold text-gray-800 mb-3">
              Train Your Agent
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Query
                </label>
                <Input
                  type="text"
                  value={trainQuery}
                  onChange={(e) => setTrainQuery(e.target.value)}
                  placeholder="Enter training query..."
                  className="w-full text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  # of Iterations
                </label>
                <Input
                  type="number"
                  value={trainIterations}
                  onChange={(e) => setTrainIterations(e.target.value)}
                  placeholder="10"
                  min="1"
                  max="100"
                  className="w-full text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              <Button
                onClick={handleTrainAgent}
                disabled={isTraining || !trainQuery.trim() || !trainIterations}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isTraining ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Training...
                  </div>
                ) : (
                  "Start Training"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tree container */}
      <div className="w-full h-full relative">
        <Tree
          data={orgChart}
          orientation="horizontal"
          translate={{ x: 150, y: 220 }}
          zoomable={true}
          draggable={true}
          collapsible={false}
          scaleExtent={{ min: 0.1, max: 4 }}
          separation={{ siblings: 0.8, nonSiblings: 1.2 }}
          renderCustomNodeElement={(rd3tProps) =>
            renderCustomNode({
              ...rd3tProps,
              selectedNode,
              onNodeClick: () => handleNodeClick(rd3tProps.nodeDatum),
            })
          }
          transitionDuration={500}
          pathClassFunc={() => "connection-line"}
          nodeSize={{ x: 200, y: 100 }}
        />

        {/* SVG Definitions for gradients and filters */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            {/* Selected node gradient */}
            <linearGradient
              id="selectedGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{
                  stopColor: "oklch(0.98 0.002 247.858)",
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "oklch(0.95 0.007 247.896)",
                  stopOpacity: 1,
                }}
              />
            </linearGradient>

            {/* Default node gradient */}
            <linearGradient
              id="defaultGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "oklch(1 0 0)", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "oklch(0.98 0.002 247.858)",
                  stopOpacity: 1,
                }}
              />
            </linearGradient>

            {/* Selected stroke gradient */}
            <linearGradient
              id="selectedStroke"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{
                  stopColor: "oklch(0.25 0.042 265.755)",
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "oklch(0.3 0.042 265.755)",
                  stopOpacity: 1,
                }}
              />
            </linearGradient>

            {/* Default stroke gradient */}
            <linearGradient
              id="defaultStroke"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{
                  stopColor: "oklch(0.85 0.013 255.508)",
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "oklch(0.8 0.013 255.508)",
                  stopOpacity: 1,
                }}
              />
            </linearGradient>

            {/* Hover stroke gradient */}
            <linearGradient
              id="hoverStroke"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{
                  stopColor: "oklch(0.25 0.042 265.755)",
                  stopOpacity: 0.6,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "oklch(0.3 0.042 265.755)",
                  stopOpacity: 0.6,
                }}
              />
            </linearGradient>

            {/* Glow effect for selected nodes */}
            <linearGradient
              id="selectedGlow"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{
                  stopColor: "oklch(0.25 0.042 265.755)",
                  stopOpacity: 0.3,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "oklch(0.4 0.042 265.755)",
                  stopOpacity: 0.1,
                }}
              />
            </linearGradient>

            {/* Filters */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="5"
                floodColor="oklch(0.15 0.042 264.695)"
                floodOpacity="0.15"
              />
            </filter>
          </defs>

          {/* Custom CSS for connection lines */}
          <style>
            {`
              .connection-line {
                stroke: oklch(0.85 0.013 255.508);
                stroke-width: 2.5;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-dasharray: 8, 4;
                opacity: 0.6;
                transition: all 0.3s ease;
              }
            `}
          </style>
        </svg>
      </div>
    </div>
  );
};

export default History;
