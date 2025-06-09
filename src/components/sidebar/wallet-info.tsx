"use client";

import { Wallet, Loader2, Copy, Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import Avatar from "boring-avatars";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useMemo } from "react";
import { formatEther } from "viem";
import { copyAddress, truncateAddress } from "@/lib/utils";
import { MagicCard } from "../magicui/magic-card";
import { storyAeneid } from "wagmi/chains";

const WalletSkeleton = () => (
  <Card className="p-0 mt-4">
    <div className="relative overflow-hidden rounded-lg">
      <CardContent className="p-0">
        <div className="flex items-center gap-3 p-4">
          <Skeleton className="h-12 w-12 rounded-full animate-pulse" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-4 w-24 rounded animate-pulse" />
              <Skeleton className="h-4 w-6 rounded animate-pulse" />
            </div>
            <Skeleton className="h-6 w-20 rounded animate-pulse" />
          </div>
        </div>
        {/* Network Information Skeleton */}
        <div className="flex items-center justify-between p-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Skeleton className="h-4 w-4 rounded animate-pulse" />
            <Skeleton className="h-4 w-20 rounded animate-pulse" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full animate-pulse" />
        </div>
      </CardContent>
    </div>
  </Card>
);

const WalletInfo = () => {
  const { address, isConnected } = useAccount();
  const { data, isLoading: walletLoading } = useBalance({ address });
  const chainId = useChainId();

  const walletData = useMemo(() => {
    return {
      address: address || "-",
      balance: data?.value ? formatEther(data?.value || 0n, "wei") : "-",
      chainId,
    };
  }, [address, data, chainId]);

  if (!isConnected) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm font-medium mb-3">
          <Wallet className="h-4 w-4 mr-2" />
          Wallet Not Connected
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <Card className="p-0">
            <CardContent className="px-4 py-4">
              <div className="text-center text-muted-foreground">
                <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Connect your wallet to continue</p>
              </div>
            </CardContent>
          </Card>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (walletLoading) return <WalletSkeleton />;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium">
        <Wallet className="h-4 w-4 mr-2" />
        Wallet Connected
        {walletLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <Card className="p-0 mt-4">
          <MagicCard gradientColor={"#262626"} className="p-0">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 p-4">
                <Avatar name={walletData.address} size={48} variant="beam" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      {truncateAddress(walletData.address || "")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyAddress(walletData.address || "")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-lg font-semibold">
                    {parseFloat(walletData.balance).toFixed(6)} IP
                  </div>
                </div>
              </div>

              {/* Network Information */}
              <div className="flex items-center justify-between p-3 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>Connected to</span>
                </div>
                <Badge variant={"secondary"} className="text-xs">
                  {chainId === storyAeneid.id
                    ? storyAeneid.name
                    : `Chain ${chainId}`}
                </Badge>
              </div>
            </CardContent>
          </MagicCard>
        </Card>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default WalletInfo;
