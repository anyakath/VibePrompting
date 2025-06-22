"use client";

import React from "react";
import dynamic from "next/dynamic";
import { OrgChartNode } from "@/lib/types";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

interface HistoryProps {
  orgChart: OrgChartNode;
  setOrgChart: React.Dispatch<React.SetStateAction<OrgChartNode>>;
  selectedNode: string | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<string | null>>;
}

const History: React.FC<HistoryProps> = ({
  orgChart,
  selectedNode,
  setSelectedNode,
}) => {
  const handleNodeClick = (nodeData: { data: { name: string } }) => {
    setSelectedNode(nodeData.data.name);
  };

  return (
    <div
      className="w-[2000px] h-full" // MAYBE: make this width expand if the tree gets too long (or just hard code idk)
    >
      <div className="mb-4 p-4">
        {selectedNode ? (
          <span className="text-sm text-gray-600">
            Selected: {selectedNode} - Type a name in the chat to add a child
            node
          </span>
        ) : (
          <span className="text-sm text-gray-600">
            Click on a node to select it, then type a name in the chat to add a
            child
          </span>
        )}
      </div>
      <Tree
        data={orgChart}
        orientation="horizontal"
        translate={{ x: 50, y: 400 }}
        zoomable={false}
        draggable={false}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
};

export default History;
