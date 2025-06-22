"use client";

import React, { useState } from "react";
import Chat from "@/app/Chat";
import History from "@/app/History";
import { OrgChartNode } from "@/lib/types";

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

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="overflow-auto flex-1 bg-slate-200">
        <History
          orgChart={orgChart}
          setOrgChart={setOrgChart}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
        />
      </div>
      <div className="w-[400px]">
        <Chat
          setOrgChart={setOrgChart}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
        />
      </div>
    </div>
  );
}
