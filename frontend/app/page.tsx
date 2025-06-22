import LandingPage from './landing';

export default function Home() {
  const [orgChart, setOrgChart] = useState<OrgChartNode>({
    name: "Booking Agent V1",
    children: [],
  });

  const [selectedNode, setSelectedNode] = useState<string>("Booking Agent V1");
  const [isLogsOpen, setIsLogsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const logsPanelRef = useRef<ImperativePanelHandle>(null);

  const expandLogs = () => {
    logsPanelRef.current?.expand();
  };

  const collapseLogs = () => {
    logsPanelRef.current?.collapse();
  };

  const handleAddNode = async (inputValue: string) => {
    if (!inputValue.trim()) return;

    setIsProcessing(true);

    // Create a Blob from the JSON data
    const blob = new Blob([JSON.stringify(AgentContent)], {
      type: "application/json",
    });

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("json_file", blob, "agent.json");
    formData.append("prompt", inputValue.trim());

    try {
      // Make API call to Flask backend with file upload
      const response = await fetch(
        "http://localhost:5000/process_json/general/1",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process prompt");
      }

      const nodeName = result.node_name || inputValue.trim();
      const targetNode = findNodeByName(orgChart, selectedNode);
      const isFirstChild = targetNode && targetNode.children.length === 0;
      const messageContent = isFirstChild
        ? `Child node "${nodeName}" added`
        : `Branch created and child node "${nodeName}" added`;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: messageContent,
          sender: "system",
        },
      ]);

      setOrgChart((prevChart) => {
        return addChildToNodeByName(prevChart, selectedNode, nodeName);
      });

      setSelectedNode(nodeName);
    } catch (error) {
      console.error("Error processing prompt:", error);

      // Add error message to logs
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `Error processing prompt: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          sender: "system",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen w-full relative bg-background">
      <PanelGroup direction="horizontal" className="h-full">
        <Panel>
          <PanelGroup direction="vertical" className="h-full">
            <Panel>
              <div className="overflow-auto h-full scrollbar-thin">
                <History
                  orgChart={orgChart}
                  selectedNode={selectedNode}
                  setSelectedNode={setSelectedNode}
                  isLogsOpen={isLogsOpen}
                />
              </div>
            </Panel>
            <PanelResizeHandle className="h-1 bg-border hover:bg-ring/50 transition-colors duration-200 group">
              <div className="w-8 h-1 bg-muted-foreground/20 rounded-full mx-auto group-hover:bg-muted-foreground/40 transition-colors duration-200" />
            </PanelResizeHandle>
            <Panel defaultSize={40} minSize={20} collapsible>
              <div className="flex flex-col h-full bg-card/50">
                <ChatInput
                  selectedNode={selectedNode}
                  onSendMessage={handleAddNode}
                  isProcessing={isProcessing}
                />
                <div className="flex-1 min-h-0 overflow-auto scrollbar-thin">
                  <AgentEditor />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="w-1 bg-border hover:bg-ring/50 transition-colors duration-200 group flex items-center justify-center">
          <div className="h-8 w-1 bg-muted-foreground/20 rounded-full group-hover:bg-muted-foreground/40 transition-colors duration-200" />
        </PanelResizeHandle>
        <Panel
          ref={logsPanelRef}
          defaultSize={25}
          collapsible
          collapsedSize={0}
          minSize={15}
          maxSize={30}
          onCollapse={() => setIsLogsOpen(false)}
          onExpand={() => setIsLogsOpen(true)}
          order={2}
        >
          <Logs
            selectedNode={selectedNode}
            toggleLogs={collapseLogs}
            messages={messages}
          />
        </Panel>
      </PanelGroup>
      {!isLogsOpen && (
        <Button
          onClick={expandLogs}
          className="absolute top-5.5 right-4 z-10 bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground rounded-lg px-4 py-2 h-auto cursor-pointer shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Logs
        </Button>
      )}
    </div>
  );
}
