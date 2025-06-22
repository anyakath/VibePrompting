export interface Message {
  id: string;
  content: string;
  sender: "user" | "system";
}

export interface OrgChartNode {
  name: string;
  attributes?: Record<string, string>;
  children: OrgChartNode[];
}
