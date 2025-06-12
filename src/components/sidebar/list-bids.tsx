"use client";

import {
  Gavel,
  Loader2,
  X,
  Calendar,
  DollarSign,
  User,
  Hash,
  Check,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import { Badge } from "../ui/badge";
import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "../ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { GENEIP_MARKETPLACE_ABI } from "@/abis";
import { GENEIP_MARKETPLACE_ADDRESS } from "@/config";
import { ImageWithFallback } from "../image-with-fallback";
import type { Bid, NFT } from "@/types";
import { useGetDetailNFT, useInsertActivity } from "@/api/query";
import { Button } from "../ui/button";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { getStatusBadgeProps } from "@/utils/badgeStatus";
import { cn } from "@/lib/utils";

const BidSkeleton = () => (
  <SidebarMenuItem>
    <SidebarMenuButton className="h-auto p-3">
      <div className="flex items-center gap-3 w-full">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

type ContractBid = {
  id: string | number;
  offerer: string;
  offerPrice: string | number;
  expireAt: string | number;
  status: number;
  nft: string;
  tokenId: string | number;
};
type DisplayBid = Bid & { contract: string; tokenId: string | number };

const BidDetailModal = ({
  bid,
  isOpen,
  onClose,
  nftData,
}: {
  bid: DisplayBid | null;
  isOpen: boolean;
  onClose: () => void;
  nftData: NFT | undefined;
}) => {
  const {
    writeContract,
    isPending,
    error: cancelError,
    data: txHash,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const { mutate: insertActivity } = useInsertActivity();
  const queryClient = useQueryClient();
  const { address } = useAccount();

  useEffect(() => {
    if (isSuccess && bid) {
      // Insert activity for bid cancellation
      insertActivity({
        nftContract: bid.contract?.toLowerCase() || "",
        tokenId: bid.tokenId,
        data: {
          id: "",
          type: "listing_canceled", // No 'bid_cancelled' in types, use 'listing_canceled'
          user: address?.toLowerCase() || "",
          timestamp: new Date().toISOString(),
          details: `Cancelled bid of ${bid.amount} IP on token #${bid.tokenId}`,
          price: bid.amount,
        },
      });
      queryClient.invalidateQueries();
      setLocalError(null);
    }
  }, [isSuccess, onClose, insertActivity, queryClient, bid, address]);

  useEffect(() => {
    if (cancelError) {
      setLocalError(cancelError.message);
    }
  }, [cancelError]);

  if (!bid) return null;

  const expireTimestamp = Number(bid.expires_at || bid.timestamp);
  const isExpired = expireTimestamp * 1000 < Date.now();
  const expireDate = expireTimestamp
    ? format(new Date(expireTimestamp * 1000), "PPpp")
    : "-";

  const handleCancel = () => {
    setLocalError(null);
    writeContract({
      address: GENEIP_MARKETPLACE_ADDRESS,
      abi: GENEIP_MARKETPLACE_ABI,
      functionName: "cancelOffer",
      args: [
        bid.contract as `0x${string}`,
        BigInt(bid.tokenId),
        BigInt(bid.id),
      ],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-sidebar p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Bid Details
          </DialogTitle>
          <DialogDescription>
            View and manage your bid information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* NFT Image and Name */}
          <div className="flex items-center gap-3 px-4">
            <ImageWithFallback
              src={nftData?.image_url || "/placeholder.svg"}
              alt={nftData?.metadata?.name || bid.contract || "NFT"}
              width={60}
              height={60}
              fallbackSrc="https://placehold.co/60x60/18181b/9f9fa9?text=No+Image"
              className="rounded-lg"
              loading="lazy"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {nftData?.metadata?.name || `NFT #${bid.tokenId}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {bid.contract?.slice(0, 6)}...{bid.contract?.slice(-4)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Bid Information */}
          <div className="space-y-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Bid Amount</span>
              </div>
              <span className="font-semibold">{bid.amount} IP</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Bid ID</span>
              </div>
              <span className="text-sm font-mono">#{bid.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <Badge
                {...getStatusBadgeProps(isExpired ? "expired" : bid.status)}
                className={cn("text-xs", getStatusBadgeProps(isExpired ? "expired" : bid.status).className)}
              >
                {isExpired ? "Expired" : bid.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Expires</span>
              </div>
              <div className="text-right">
                <span className={`text-sm ${isExpired ? "text-red-500" : ""}`}>
                  {expireDate}
                </span>
                {isExpired && (
                  <div className="text-xs text-red-500 font-medium">
                    Expired
                  </div>
                )}
              </div>
            </div>
          </div>

          {localError && (
            <div className="p-3 bg-red-950/30 border border-red-900 rounded-md mx-4">
              <p className="text-sm text-red-600">
                {localError.length > 120
                  ? localError.slice(0, 120) + "..."
                  : localError}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {bid.status === "active" && !isExpired && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isPending || isConfirming || isSuccess}
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isConfirming ? "Waiting..." : "Cancelling..."}
                </>
              ) : isSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Cancelled
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Cancel Bid
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BidItem = ({
  bid,
  index,
  setHoveredItem,
  onBidClick,
}: {
  bid: DisplayBid;
  index: number;
  setHoveredItem: (i: number | null) => void;
  onBidClick: (bid: DisplayBid) => void;
}) => {
  const { data: nftData } = useGetDetailNFT(bid.contract, Number(bid.tokenId));

  // Expiry logic
  const expireTimestamp = Number(bid.expires_at || bid.timestamp);
  const isExpired = expireTimestamp * 1000 < Date.now();

  return (
    <SidebarMenuItem
      key={bid.id}
      onMouseEnter={() => setHoveredItem(index)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <SidebarMenuButton
        className="h-auto p-3 relative z-10 cursor-pointer"
        onClick={() => onBidClick(bid)}
      >
        <div className="flex items-center gap-3 w-full">
          <ImageWithFallback
            key={nftData?.image_url || bid.id}
            src={nftData?.image_url || "/placeholder.svg"}
            alt={nftData?.metadata?.name || bid.contract || "NFT"}
            width={40}
            height={40}
            fallbackSrc="https://placehold.co/40x40/18181b/9f9fa9?text=No+Image"
            className="rounded-md"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {nftData?.metadata?.name ||
                bid.contract?.slice(0, 6) + "...#" + bid.tokenId}
            </div>
            <div className="text-xs text-muted-foreground">
              Bid: {bid.amount} IP
            </div>
          </div>
          <Badge
            {...getStatusBadgeProps(isExpired ? "expired" : bid.status)}
            className={cn("text-xs", getStatusBadgeProps(isExpired ? "expired" : bid.status).className)}
          >
            {isExpired ? "Expired" : bid.status}
          </Badge>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const ListBids = () => {
  const { address } = useAccount();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedBid, setSelectedBid] = useState<DisplayBid | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: bidsData, isLoading: bidsLoading } = useReadContract({
    address: GENEIP_MARKETPLACE_ADDRESS,
    abi: GENEIP_MARKETPLACE_ABI,
    functionName: "getOffersFrom",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  const { data: selectedNftData } = useGetDetailNFT(
    selectedBid?.contract || "",
    Number(selectedBid?.tokenId || 0)
  );

  const bids: DisplayBid[] = ((bidsData || []) as unknown as ContractBid[]).map(
    (bid) => ({
      id: bid.id?.toString() ?? "",
      bidder: bid.offerer,
      amount: bid.offerPrice ? (Number(bid.offerPrice) / 1e18).toString() : "0",
      timestamp: bid.expireAt?.toString() ?? "",
      avatar: bid.offerer,
      expires_at: bid.expireAt?.toString() ?? "",
      status:
        typeof bid.status === "number"
          ? (["active", "accepted", "cancelled", "expired"][bid.status] as import("@/types").BidStatus)
          : "active",
      contract: bid.nft,
      tokenId: bid.tokenId,
    })
  )
  // Sort by timestamp descending (latest first)
  .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  const handleBidClick = useCallback((bid: DisplayBid) => {
    setSelectedBid({ ...bid });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedBid(null);
  }, []);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm font-medium mb-3">
          <Gavel className="h-4 w-4 mr-2" />
          Your Bids {!bidsLoading && `(${bids.length})`}
          {bidsLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="relative">
            {bidsLoading ? (
              <>
                <BidSkeleton />
                <BidSkeleton />
              </>
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
                {bids.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-xs">
                    No bids found
                  </div>
                ) : (
                  bids.map((bid, index) => (
                    <BidItem
                      key={bid.id}
                      bid={bid}
                      index={index}
                      setHoveredItem={setHoveredItem}
                      onBidClick={handleBidClick}
                    />
                  ))
                )}
              </>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <BidDetailModal
        bid={selectedBid}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        nftData={selectedNftData}
      />
    </>
  );
};

export default ListBids;
