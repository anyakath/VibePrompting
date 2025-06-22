"use client";

import React from "react";
import dynamic from "next/dynamic";
import { OrgChartNode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TreeNodeDatum } from "react-d3-tree";
import { cn } from "@/lib/utils";

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
          r={20}
          fill="url(#selectedGlow)"
          opacity="0.4"
          filter="url(#glow)"
        />
      )}

      {/* Main node circle with gradient */}
      <circle
        r={15}
        fill={isSelected ? "url(#selectedGradient)" : "url(#defaultGradient)"}
        strokeWidth={isSelected ? 3 : 2}
        stroke={isSelected ? "#374151" : "#d1d5db"}
        onClick={onNodeClick}
        className="cursor-pointer transition-all duration-200 hover:r-18"
        filter={isSelected ? "url(#shadow)" : "none"}
      />

      {/* Node label with better styling */}
      <text
        strokeWidth="0"
        x="0"
        y="35"
        textAnchor="middle"
        className={cn(
          "text-sm font-medium transition-all duration-200",
          isSelected ? "fill-gray-900 font-semibold" : "fill-gray-700"
        )}
        style={{
          textShadow: isSelected ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
          fontSize: isSelected ? "14px" : "13px",
        }}
      >
        {nodeDatum.name}
      </text>

      {/* Hover effect indicator */}
      <circle
        r={15}
        fill="transparent"
        stroke="transparent"
        onClick={onNodeClick}
        className="cursor-pointer"
        onMouseEnter={(e) => {
          e.currentTarget.style.stroke = "#374151";
          e.currentTarget.style.strokeWidth = "2";
          e.currentTarget.style.opacity = "0.3";
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
  const handleNodeClick = (nodeData: TreeNodeDatum) => {
    setSelectedNode(nodeData.name);
  };

  return (
    <div className="w-full h-full relative">
      {/* Simple header */}
      <div
        className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 backdrop-blur-sm"
        style={{ backgroundColor: "transparent" }}
      >
        <h2 className="text-lg font-semibold text-gray-900">Booking Agent</h2>
        <div className={cn(!isLogsOpen && "mr-20")}>
          <Button className="bg-gray-900 text-white hover:bg-gray-800">
            Run Agent
          </Button>
        </div>
      </div>

      {/* Tree container */}
      <div className="w-full h-full pt-20">
        <Tree
          data={orgChart}
          orientation="horizontal"
          translate={{ x: 150, y: 170 }}
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
                style={{ stopColor: "#f3f4f6", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#e5e7eb", stopOpacity: 1 }}
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
                style={{ stopColor: "#ffffff", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#f9fafb", stopOpacity: 1 }}
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
                style={{ stopColor: "#374151", stopOpacity: 0.2 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#6b7280", stopOpacity: 0.1 }}
              />
            </linearGradient>

            {/* Filters */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="4"
                floodColor="#374151"
                floodOpacity="0.2"
              />
            </filter>
          </defs>

          {/* Custom CSS for connection lines */}
          <style>
            {`
              .connection-line {
                stroke: #d1d5db;
                stroke-width: 2.5;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-dasharray: 8, 4;
                opacity: 0.7;
                transition: all 0.3s ease;
              }

              .connection-line:hover {
                stroke-width: 3;
                opacity: 1;
                stroke-dasharray: 12, 6;
              }
            `}
          </style>
        </svg>
      </div>
    </div>
  );
};

export default History;
