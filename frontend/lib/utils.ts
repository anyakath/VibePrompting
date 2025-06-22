import { OrgChartNode } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addChild(
  name: string,
  attributes?: Record<string, string>
): OrgChartNode {
  return {
    name,
    attributes: attributes || {},
    children: [],
  };
}

export function appendChildToOrgChart(
  orgChart: OrgChartNode,
  childName: string,
  attributes?: Record<string, string>
): OrgChartNode {
  return {
    ...orgChart,
    children: [...orgChart.children, addChild(childName, attributes)],
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

// Add a child to a specific node by name
export function addChildToNodeByName(
  orgChart: OrgChartNode,
  targetNodeName: string,
  childName: string,
  attributes?: Record<string, string>
): OrgChartNode {
  const newOrgChart = { ...orgChart };

  function updateNode(node: OrgChartNode): OrgChartNode {
    if (node.name === targetNodeName) {
      return {
        ...node,
        children: [...node.children, addChild(childName, attributes)],
      };
    }

    return {
      ...node,
      children: node.children.map(updateNode),
    };
  }

  return updateNode(newOrgChart);
}
