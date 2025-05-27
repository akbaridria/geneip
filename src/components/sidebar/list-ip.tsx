"use client";

import { ImageIcon, Loader2, Plus, Shield, PlusIcon } from "lucide-react";
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
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Asset {
  id: number;
  name: string;
  image: string;
  value: string;
  isIpAsset: boolean; // Flag to distinguish IP Assets from regular NFTs
}

const ipAssets: Asset[] = [
  {
    id: 1,
    name: "Digital Art #001",
    image:
      "https://i2.seadn.io/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/4877a29aad1cffa828a770bc216798/854877a29aad1cffa828a770bc216798.png?w=1000",
    value: "Alchemist Moops",
    isIpAsset: true,
  },
  {
    id: 2,
    name: "Music Track #042",
    image:
      "https://i2.seadn.io/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/4877a29aad1cffa828a770bc216798/854877a29aad1cffa828a770bc216798.png?w=1000",
    value: "Alchemist Moops",
    isIpAsset: false,
  },
  {
    id: 3,
    name: "Patent Design",
    image:
      "https://i2.seadn.io/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/4877a29aad1cffa828a770bc216798/854877a29aad1cffa828a770bc216798.png?w=1000",
    value: "Alchemist Moops",
    isIpAsset: true,
  },
  {
    id: 4,
    name: "Collectible #789",
    image:
      "https://i2.seadn.io/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/4877a29aad1cffa828a770bc216798/854877a29aad1cffa828a770bc216798.png?w=1000",
    value: "Alchemist Moops",
    isIpAsset: false,
  },
];

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

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium mb-3">
        <ImageIcon className="h-4 w-4 mr-2" />
        Your Assets{" "}
        {!assetsLoading && ipAssets.length > 0 && `(${ipAssets.length})`}
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
            ) : ipAssets.length === 0 ? (
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
                {ipAssets.map((asset, index) => (
                  <SidebarMenuItem
                    key={asset.id}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <SidebarMenuButton className="h-auto p-3 relative z-10">
                      <div className="flex items-center gap-3 w-full">
                        <div className="relative">
                          <img
                            src={asset.image || "/placeholder.svg"}
                            alt={asset.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div className="absolute -top-1 -right-1">
                            {asset.isIpAsset ? (
                              <Badge
                                variant="secondary"
                                className="h-5 w-5 p-0 rounded-full"
                              >
                                <Shield className="h-2.5 w-2.5" />
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="h-5 w-5 p-0 rounded-full"
                              >
                                <ImageIcon className="h-2.5 w-2.5" />
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium truncate">
                              {asset.name}
                            </div>
                            {asset.isIpAsset && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5"
                              >
                                IP
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {asset.value}
                          </div>
                        </div>
                        {!asset.isIpAsset && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  className="h-6 w-6 p-0"
                                  size="icon"
                                  variant="outline"
                                >
                                  <PlusIcon className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Register as IP Asset</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
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

export default ListIp;
