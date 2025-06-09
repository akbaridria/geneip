"use client";

import { ImageIcon, Loader2, Plus, Shield, ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useGetAllNfts } from "@/api/query";
import { useAccount, useChainId, useReadContract } from "wagmi";
import type { NFT } from "@/types";
import { IP_ASSET_REGISTRY_ABI } from "@/abis";
import { IP_ASSET_REGISTRY_ADDRESS } from "@/config";
import { ImageWithFallback } from "../image-with-fallback";

const AssetSkeleton = () => (
  <SidebarMenuItem>
    <SidebarMenuButton className="h-auto p-3">
      <div className="flex items-center gap-3 w-full">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-4" />
      </div>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
    <div className="rounded-full bg-muted p-3 mb-4">
      <ImageIcon className="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 className="text-sm font-medium mb-2">No assets found</h3>
    <p className="text-xs text-muted-foreground mb-4 max-w-[200px]">
      You don't have any IP assets or NFTs yet. Start by connecting your wallet
      or creating your first asset.
    </p>
    <Button size="sm" className="h-8">
      <Plus className="h-3 w-3 mr-1" />
      Add Asset
    </Button>
  </div>
);

const ListIp = () => {
  const [assetsLoading] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const { address } = useAccount();
  const { data } = useGetAllNfts(address || "");

  const allNfts = useMemo(() => data || [], [data]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium mb-3">
        <ImageIcon className="h-4 w-4 mr-2" />
        Your Assets{" "}
        {!assetsLoading && allNfts.length > 0 && `(${allNfts.length})`}
        {assetsLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
      </SidebarGroupLabel>
      <ScrollArea className="max-h-[272px]">
        <SidebarGroupContent>
          <SidebarMenu className="relative">
            {assetsLoading ? (
              <>
                <AssetSkeleton />
                <AssetSkeleton />
                <AssetSkeleton />
              </>
            ) : allNfts.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <AnimatePresence>
                  {hoveredItem !== null && (
                    <motion.div
                      layoutId="hover-bg"
                      className="absolute left-0 right-0 bg-sidebar-accent text-sidebar-accent-foreground rounded-md pointer-events-none z-0"
                      style={{
                        top: `${hoveredItem * 68}px`,
                        height: "64px",
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </AnimatePresence>
                {allNfts.map((asset, index) => (
                  <SidebarMenuItem
                    key={asset.id}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <SidebarMenuButton className="h-auto p-3 relative z-10">
                      <Asset data={asset} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </ScrollArea>
    </SidebarGroup>
  );
};

const Asset: React.FC<{ data: NFT }> = ({ data }) => {
  const chainId = useChainId();

  const { data: predictedIpId } = useReadContract({
    address: IP_ASSET_REGISTRY_ADDRESS,
    abi: IP_ASSET_REGISTRY_ABI,
    functionName: "ipId",
    args: [
      BigInt(chainId),
      data.token.address_hash as `0x${string}`,
      BigInt(data.id),
    ],
  });
  console.log(predictedIpId);

  const isIpAsset = useMemo(() => !!predictedIpId, [predictedIpId]);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative">
        <ImageWithFallback
          src={data.image_url || "/placeholder.svg"}
          alt={data.token.name}
          width={40}
          height={40}
          fallbackSrc="https://placehold.co/40x40?text=No+Image"
          className="rounded-md"
        />
        <div className="absolute -top-1 -right-1">
          {isIpAsset ? (
            <Badge variant="secondary" className="h-5 w-5 p-0 rounded-full">
              <Shield className="h-2.5 w-2.5" />
            </Badge>
          ) : (
            <Badge variant="secondary" className="h-5 w-5 p-0 rounded-full">
              <ImageIcon className="h-2.5 w-2.5" />
            </Badge>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium truncate">{data.token.name}</div>
          {!isIpAsset && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              IP
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground">{data.metadata.name + ' #' + data.id}</div>
      </div>
      {isIpAsset && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button className="h-6 w-6 p-0" size="icon" variant="outline">
                <ChevronRight className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Track Lineage</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default ListIp;
