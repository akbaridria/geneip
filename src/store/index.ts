import { create } from "zustand";
import { type Node, type Edge, MarkerType } from "@xyflow/react";
import type { Track } from "@/types";
import { toast } from "sonner";

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
  isOpenDialogDetailIP: boolean;
  setIsOpenDialogDetailIP: (isOpen: boolean) => void;
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

    if (lineage.length > 100) {
      toast.warning("Warning: Large Lineage Data", {
        description:
          "The lineage has more than 100 tracks, which may affect performance.",
      });
    }

    lineage.forEach((track) => {
      if (nodes.length >= 100) {
        return;
      }
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
          type: "ipAsset",
          position: { x: 0, y: 100 * track.depth },
          data: {
            asset_id: track.child_id,
            metadata: track.child_metadata,
          },
        });
        processedNodeIds.add(track.child_id);
      }

      edges.push({
        id: `${track.parent_id}-${track.child_id}`,
        source: track.parent_id,
        target: track.child_id,
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: "white",
        },
        // label: "marker size and color",
        style: {
          strokeWidth: 1,
          stroke: "white",
        },
      });
    });

    return { nodes, edges };
  },
  isOpenDialogDetailIP: false,
  setIsOpenDialogDetailIP: (isOpen) => set({ isOpenDialogDetailIP: isOpen }),
}));
