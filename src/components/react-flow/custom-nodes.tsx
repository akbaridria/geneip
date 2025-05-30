"use client";

import type React from "react";

import { memo, useState } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { IpAssetNodeData } from "@/types";
import { ImageWithFallback } from "../image-with-fallback";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spotlight, SpotlightCard } from "./spotlight";

type IpAssetNodeType = Node<IpAssetNodeData, "ipAsset" | "selectedIpAsset">;

const IpAssetNodeComponent: React.FC<NodeProps<IpAssetNodeType>> = ({
  data,
  selected,
  type,
}) => {
  const asset = data;
  const [showModal, setShowModal] = useState(false);

  // Cursor animation
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  const isSelectedType = type === "selectedIpAsset";

  return (
    <>
      {isSelectedType ? (
        <Spotlight className="group">
          <SpotlightCard
            onClick={() => setShowModal(true)}
            onMouseMove={handleMouseMove}
            className="relative w-[200px] cursor-pointer"
          >
            <CardContent className="p-3">
              <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-primary border-2 border-background z-10"
              />

              <div className="flex flex-col gap-2">
                <div className="relative w-full h-[120px] rounded-md overflow-hidden mb-2">
                  <ImageWithFallback
                    src={asset.metadata?.imageUrl || "/placeholder.svg"}
                    alt={asset.metadata?.name || "IP Asset"}
                    className="w-full h-full object-cover"
                    fallbackSrc="https://placehold.co/48x48?text=No+Image"
                  />
                  <motion.div
                    className="absolute w-10 h-10 rounded-full bg-primary/20 pointer-events-none blur-xl"
                    style={{
                      x: cursorXSpring,
                      y: cursorYSpring,
                    }}
                  />
                </div>

                <div className="text-sm font-medium truncate">
                  {asset.metadata?.name ||
                    `Asset ${asset.asset_id.slice(0, 8)}`}
                </div>

                <div className="text-xs text-muted-foreground truncate">
                  ID: {asset.asset_id.substring(0, 12)}...
                </div>

                {asset.metadata?.chainId && (
                  <div className="text-xs text-muted-foreground">
                    Chain: {asset.metadata.chainId}
                  </div>
                )}
              </div>

              <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-primary border-2 border-background z-10"
              />
            </CardContent>
          </SpotlightCard>
        </Spotlight>
      ) : (
        <Card
          onClick={() => setShowModal(true)}
          onMouseMove={handleMouseMove}
          className={cn(
            "relative w-[200px] cursor-pointer",
            selected ? "ring-2 ring-primary/50" : ""
          )}
        >
          <CardContent className="p-3">
            <Handle
              type="target"
              position={Position.Top}
              className="w-3 h-3 !bg-primary border-2 border-background z-10"
            />

            <div className="flex flex-col gap-2">
              <div className="relative w-full h-[120px] rounded-md overflow-hidden mb-2">
                <ImageWithFallback
                  src={asset.metadata?.imageUrl || "/placeholder.svg"}
                  alt={asset.metadata?.name || "IP Asset"}
                  className="w-full h-full object-cover"
                  fallbackSrc="https://placehold.co/48x48?text=No+Image"
                />
                <motion.div
                  className="absolute w-10 h-10 rounded-full bg-primary/20 pointer-events-none blur-xl"
                  style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                  }}
                />
              </div>

              <div className="text-sm font-medium truncate">
                {asset.metadata?.name || `Asset ${asset.asset_id.slice(0, 8)}`}
              </div>

              <div className="text-xs text-muted-foreground truncate">
                ID: {asset.asset_id.substring(0, 12)}...
              </div>

              {asset.metadata?.chainId && (
                <div className="text-xs text-muted-foreground">
                  Chain: {asset.metadata.chainId}
                </div>
              )}
            </div>

            <Handle
              type="source"
              position={Position.Bottom}
              className="w-3 h-3 !bg-primary border-2 border-background z-10"
            />
          </CardContent>
        </Card>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col gap-4">
            <div className="relative w-full h-[240px] rounded-md overflow-hidden">
              <ImageWithFallback
                src={asset.metadata?.imageUrl || "/placeholder.svg"}
                alt={asset.metadata?.name || "IP Asset"}
                className="w-full h-full object-cover"
                fallbackSrc="https://placehold.co/400x240?text=No+Image"
              />
            </div>

            <h2 className="text-xl font-bold">
              {asset.metadata?.name || `Asset ${asset.asset_id.slice(0, 8)}`}
            </h2>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Asset ID:</div>
              <div>{asset.asset_id}</div>

              {asset.metadata?.chainId && (
                <>
                  <div className="font-medium">Chain:</div>
                  <div>{asset.metadata.chainId}</div>
                </>
              )}

              {/* {asset.metadata?.description && (
                <>
                  <div className="font-medium">Description:</div>
                  <div className="col-span-2">{asset.metadata.description}</div>
                </>
              )} */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const MemoIpAssetNode = memo(IpAssetNodeComponent);
export default MemoIpAssetNode;
