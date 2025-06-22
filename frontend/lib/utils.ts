import { OrgChartNode } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addChild(
  name: string,
  id: string,
  attributes?: Record<string, string>,
  jsonData?: Record<string, unknown>
): OrgChartNode {
  return {
    id,
    name,
    attributes: attributes || {},
    children: [],
    jsonData,
  };
}

export function appendChildToOrgChart(
  orgChart: OrgChartNode,
  childName: string,
  childId: string,
  attributes?: Record<string, string>,
  jsonData?: Record<string, unknown>
): OrgChartNode {
  return {
    ...orgChart,
    children: [...orgChart.children, addChild(childName, childId, attributes, jsonData)],
  };
}

// Find a node by name in the tree (depth-first search)
export function findNodeByName(
  node: OrgChartNode,
  targetName: string
): OrgChartNode | null {
  if (node.name === targetName) {
    return node;
  }

  for (const child of node.children) {
    const found = findNodeByName(child, targetName);
    if (found) {
      return found;
    }
  }

  return null;
}

// Find a node by ID in the tree (depth-first search)
export function findNodeById(
  node: OrgChartNode,
  targetId: string
): OrgChartNode | null {
  if (node.id === targetId) {
    return node;
  }

  for (const child of node.children) {
    const found = findNodeById(child, targetId);
    if (found) {
      return found;
    }
  }

  return null;
}

// Add a child to a specific node by name
export function addChildToNodeByName(
  orgChart: OrgChartNode,
  targetNodeName: string,
  childName: string,
  childId: string,
  attributes?: Record<string, string>,
  jsonData?: Record<string, unknown>
): OrgChartNode {
  const newOrgChart = { ...orgChart };

  function updateNode(node: OrgChartNode): OrgChartNode {
    if (node.name === targetNodeName) {
      return {
        ...node,
        children: [...node.children, addChild(childName, childId, attributes, jsonData)],
      };
    }

    return {
      ...node,
      children: node.children.map(updateNode),
    };
  }

  return updateNode(newOrgChart);
}

// Truncate text to specified length with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

// Generate a unique ID for nodes
export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
