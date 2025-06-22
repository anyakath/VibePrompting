export interface Message {
  id: string;
  content: string;
  sender: "user" | "system";
}

export interface OrgChartNode {
  id: string;
  name: string;
  attributes?: Record<string, string>;
  children: OrgChartNode[];
  jsonData?: Record<string, unknown>; // Store the generated JSON data for each node
}
