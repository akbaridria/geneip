import { create } from "zustand";
import type { Node, Edge } from "@xyflow/react";
import type { Track } from "@/types";

interface IpGraphState {
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;

  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;

  lineageData: Track[] | null;
  setLineageData: (data: Track[] | null) => void;
  getGraphDataFromLineage: (lineage: Track[]) => {
    nodes: Node[];
    edges: Edge[];
  };
}

export const useIpGraphStore = create<IpGraphState>((set) => ({
  selectedAssetId: null,
  setSelectedAssetId: (id) => set({ selectedAssetId: id }),

  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  lineageData: null,
  setLineageData: (data) => set({ lineageData: data }),

  getGraphDataFromLineage: (lineage) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const processedNodeIds = new Set<string>();

    lineage.forEach((track) => {
      if (!processedNodeIds.has(track.parent_id)) {
        nodes.push({
          id: track.parent_id,
          type: "ipAsset",
          position: { x: 0, y: 0 },
          data: {
            asset_id: track.parent_id,
            metadata: track.parent_metadata,
          },
        });
        processedNodeIds.add(track.parent_id);
      }

      if (!processedNodeIds.has(track.child_id)) {
        nodes.push({
          id: track.child_id,
          type: "selectedIpAsset",
          position: { x: 0, y: 100 * track.depth },
          data: {
            asset_id: track.parent_id,
            metadata: track.parent_metadata,
          },
        });
        processedNodeIds.add(track.child_id);
      }

      edges.push({
        id: `${track.parent_id}-${track.child_id}`,
        source: track.parent_id,
        target: track.child_id,
        animated: true,
      });
    });

    return { nodes, edges };
  },
}));
