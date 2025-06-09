"use client";

import { useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  type NodeTypes,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useIpGraphStore } from "@/store";
import { useTrackById } from "@/api/query";
import IpAssetNode from "@/components/react-flow/ip-asset-node";
import { Loader2, Search } from "lucide-react";
import { cn, getLayoutedElements } from "@/lib/utils";
import { toast } from "sonner";
import { CommandSearch } from "./command-search";

const nodeTypes: NodeTypes = {
  ipAsset: IpAssetNode,
};

function IpGraph() {
  const { selectedAssetId, isLoading, getGraphDataFromLineage } =
    useIpGraphStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();

  const {
    data: trackData,
    isLoading: trackLoading,
    error,
  } = useTrackById(selectedAssetId || "");

  useEffect(() => {
    if (error) {
      toast.error("Error loading lineage", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        duration: 5000,
      });
    }
  }, [error]);

  useEffect(() => {
    if (trackData && Array.isArray(trackData)) {
      try {
        const graphData = getGraphDataFromLineage(trackData);
        const data = getLayoutedElements(graphData.nodes, graphData.edges);
        setNodes(data.nodes);
        setEdges(data.edges);
        fitView({
          nodes: [{ id: selectedAssetId || "" }],
          maxZoom: 0.6,
          padding: {
            top: 0.2,
          },
        });
      } catch (err) {
        console.error("Failed to process graph data:", err);
        toast.error("Failed to process graph data");
      }
    }
  }, [getGraphDataFromLineage, setNodes, setEdges, fitView, trackData, selectedAssetId]);

  const isLoadingState = trackLoading || isLoading;

  const renderIdleState = () => {
    if (!selectedAssetId) {
      return (
        <div className="absolute inset-0 z-3 flex items-center justify-center bg-background/70">
          <div className="p-8 rounded-lg border bg-card shadow-md">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 rounded-full bg-muted/20">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">No Asset Selected</h3>
                <p className="text-muted-foreground max-w-md">
                  Search and select an IP asset to view its lineage graph
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLoadingState = () => {
    if (isLoadingState) {
      return (
        <div className="absolute inset-0 z-3 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
          <div className="p-8 rounded-lg border bg-card/95 shadow-md">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 rounded-full bg-muted/20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Loading Lineage</h3>
                <p className="text-muted-foreground">
                  Fetching IP asset lineage data...
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative h-full w-full">
      {/* ReactFlow - always rendered */}
      <CommandSearch />
      <div className={cn("h-full w-full", isLoadingState && "blur-[2px]")}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          colorMode="dark"
          edgesFocusable={false}
          nodesFocusable={false}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Render states */}
      {renderIdleState()}
      {renderLoadingState()}
    </div>
  );
}

export default function IpGraphWrapper() {
  return (
    <ReactFlowProvider>
      <IpGraph />
    </ReactFlowProvider>
  );
}
