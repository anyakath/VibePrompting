"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { appendChildToOrgChart, addChildToNodeByName } from "@/lib/utils";
import { OrgChartNode } from "@/lib/types";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

const History = () => {
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

  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeClick = (nodeData: any) => {
    setSelectedNode(nodeData.data.name);
  };

  const handleAddChild = () => {
    if (selectedNode) {
      // Add child to the selected node
      setOrgChart((prevChart) =>
        addChildToNodeByName(prevChart, selectedNode, "New Employee")
      );
    } else {
      // Fallback to adding to root if no node is selected
      setOrgChart((prevChart) =>
        appendChildToOrgChart(prevChart, "New Employee")
      );
    }
  };

  return (
    <div
      className="w-[2000px] h-full" // MAYBE: make this width expand if the tree gets too long (or just hard code idk)
    >
      <div className="mb-4">
        <Button onClick={handleAddChild}>
          Add Child {selectedNode ? `to ${selectedNode}` : "to Root"}
        </Button>
        {selectedNode && (
          <span className="ml-4 text-sm text-gray-600">
            Selected: {selectedNode}
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
