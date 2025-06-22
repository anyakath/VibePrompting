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
}: CustomNodeElementProps) => (
  <g>
    <circle
      r={15}
      fill={nodeDatum.name === selectedNode ? "#e2e8f0" : "#ffffff"}
      strokeWidth={1}
      stroke="#6b7280"
      onClick={onNodeClick}
    />
    <text
      strokeWidth="0"
      x="25"
      dy=".35em"
      className="text-sm fill-current text-gray-800"
    >
      {nodeDatum.name}
    </text>
  </g>
);

const History: React.FC<HistoryProps> = ({
  orgChart,
  selectedNode,
  setSelectedNode,
  isLogsOpen,
}) => {
  const handleNodeClick = (nodeData: TreeNodeDatum) => {
    setSelectedNode(nodeData.name);
  };

  const handleRunAgent = async () => {
    try {
      await fetch("http://localhost:5000/retrigger_adk_web", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error retriggering agent:", error);
    }
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <h2 className="text-lg font-semibold">Booking Agent</h2>
        <div className={cn(!isLogsOpen && "mr-15")}>
          <Button
            className="bg-black text-white cursor-pointer"
            onClick={handleRunAgent}
          >
            Run Agent
          </Button>
        </div>
      </div>
      <div className="w-full h-full">
        <Tree
          data={orgChart}
          orientation="horizontal"
          translate={{ x: 100, y: 250 }}
          zoomable={true}
          draggable={true}
          collapsible={false}
          scaleExtent={{ min: 0.1, max: 4 }}
          renderCustomNodeElement={(rd3tProps) =>
            renderCustomNode({
              ...rd3tProps,
              selectedNode,
              onNodeClick: () => handleNodeClick(rd3tProps.nodeDatum),
            })
          }
          transitionDuration={500}
        />
      </div>
    </div>
  );
};

export default History;
