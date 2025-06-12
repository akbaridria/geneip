import {
  TrendingUp,
  Loader2,
  Check,
  Calendar,
  DollarSign,
  User,
  Hash,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import { useState, useCallback, useEffect } from "react";
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
import { useGetDetailNFT } from "@/api/query";
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
import { Badge } from "../ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useInsertActivity } from "@/api/query";
import { erc721Abi } from "viem";
import { getStatusBadgeProps } from "@/utils/badgeStatus";
import { cn } from "@/lib/utils";

const OfferSkeleton = () => (
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

type ContractOffer = {
  id: string | number;
  offerer: string;
  offerPrice: string | number;
  expireAt: string | number;
  status: number;
  nft: string;
  tokenId: string | number;
};
type DisplayOffer = {
  id: string;
  offerer: string;
  amount: string;
  timestamp: string;
  expires_at: string;
  status: string;
  contract: string;
  tokenId: string | number;
};

const OfferDetailModal = ({
  offer,
  isOpen,
  onClose,
  nftData,
  refetchOffers,
}: {
  offer: DisplayOffer | null;
  isOpen: boolean;
  onClose: () => void;
  nftData: import("@/types").NFT | undefined;
  refetchOffers: () => void;
}) => {
  const {
    writeContract,
    isPending,
    error: acceptError,
    data: txHash,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { mutate: insertActivity } = useInsertActivity();

  // Approval check
  const { data: approvedAddress, refetch: refetchApproval } = useReadContract({
    address: offer?.contract as `0x${string}`,
    abi: erc721Abi,
    functionName: "getApproved",
    args: [BigInt(offer?.tokenId || 0)],
    query: { enabled: !!offer?.contract && !!offer?.tokenId },
  });
  const isApproved =
    approvedAddress?.toLowerCase() === GENEIP_MARKETPLACE_ADDRESS.toLowerCase();

  // Approve NFT
  const {
    writeContract: approve,
    data: approveHash,
    isPending: isApproving,
    error: approveError,
  } = useWriteContract();
  const { isSuccess: approveSuccess, isLoading: isConfirmingApprove } =
    useWaitForTransactionReceipt({ hash: approveHash });

  useEffect(() => {
    if (approveSuccess) {
      refetchApproval();
    }
  }, [approveSuccess, refetchApproval]);

  useEffect(() => {
    if (isSuccess && offer) {
      // Insert activity for offer acceptance
      insertActivity({
        nftContract: offer.contract?.toLowerCase() || "",
        tokenId: offer.tokenId,
        data: {
          id: "",
          type: "bid_accepted",
          user: address?.toLowerCase() || "",
          timestamp: new Date().toISOString(),
          details: `Accepted offer of ${offer.amount} IP on token #${offer.tokenId}`,
          price: offer.amount,
        },
      });
      queryClient.invalidateQueries();
      onClose();
      setLocalError(null);
      refetchOffers();
    }
  }, [
    isSuccess,
    onClose,
    refetchOffers,
    insertActivity,
    queryClient,
    offer,
    address,
  ]);

  useEffect(() => {
    if (acceptError) {
      setLocalError(acceptError.message);
    }
  }, [acceptError]);

  useEffect(() => {
    if (approveError) {
      setLocalError(approveError.message);
    }
  }, [approveError]);

  if (!offer) return null;

  const expireTimestamp = Number(offer.expires_at || offer.timestamp);
  const isExpired = expireTimestamp * 1000 < Date.now();
  const expireDate = expireTimestamp
    ? format(new Date(expireTimestamp * 1000), "PPpp")
    : "-";

  const handleApprove = () => {
    setLocalError(null);
    approve({
      address: offer.contract as `0x${string}`,
      abi: erc721Abi,
      functionName: "approve",
      args: [GENEIP_MARKETPLACE_ADDRESS, BigInt(offer.tokenId)],
    });
  };

  const handleAccept = () => {
    setLocalError(null);
    writeContract({
      address: GENEIP_MARKETPLACE_ADDRESS,
      abi: GENEIP_MARKETPLACE_ABI,
      functionName: "acceptOffer",
      args: [
        offer.contract as `0x${string}`,
        BigInt(offer.tokenId),
        BigInt(offer.id),
      ],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-sidebar p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Offer Details
          </DialogTitle>
          <DialogDescription>
            View and manage offer information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* NFT Image and Name */}
          <div className="flex items-center gap-3 px-4">
            <ImageWithFallback
              key={nftData?.image_url || offer.id}
              src={nftData?.image_url || "/placeholder.svg"}
              alt={nftData?.metadata?.name || offer.contract || "NFT"}
              width={60}
              height={60}
              fallbackSrc="https://placehold.co/60x60/18181b/9f9fa9?text=No+Image"
              className="rounded-lg"
              loading="lazy"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {nftData?.metadata?.name || `NFT #${offer.tokenId}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {offer.contract?.slice(0, 6)}...{offer.contract?.slice(-4)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Offer Information */}
          <div className="space-y-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Offer Amount</span>
              </div>
              <span className="font-semibold">{offer.amount} IP</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Offer ID</span>
              </div>
              <span className="text-sm font-mono">#{offer.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <Badge
                {...getStatusBadgeProps(isExpired ? "expired" : offer.status)}
                className={cn("text-xs", getStatusBadgeProps(isExpired ? "expired" : offer.status).className)}
              >
                {isExpired ? "Expired" : offer.status}
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
          {offer.status === "active" && !isExpired && !isApproved && (
            <Button
              variant="primary"
              onClick={handleApprove}
              disabled={isApproving || isConfirmingApprove}
            >
              {isApproving || isConfirmingApprove ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Approving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Approve NFT
                </>
              )}
            </Button>
          )}
          {offer.status === "active" && !isExpired && isApproved && (
            <Button
              variant="primary"
              onClick={handleAccept}
              disabled={isPending || isConfirming}
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isConfirming ? "Waiting..." : "Accepting..."}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Accept Offer
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const OfferItem = ({
  offer,
  index,
  setHoveredItem,
  onOfferClick,
}: {
  offer: DisplayOffer;
  index: number;
  setHoveredItem: (i: number | null) => void;
  onOfferClick: (offer: DisplayOffer) => void;
}) => {
  const { data: nftData } = useGetDetailNFT(
    offer.contract,
    Number(offer.tokenId)
  );
  const expireTimestamp = Number(offer.expires_at || offer.timestamp);
  const isExpired = expireTimestamp * 1000 < Date.now();
  return (
    <SidebarMenuItem
      key={offer.id}
      onMouseEnter={() => setHoveredItem(index)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <SidebarMenuButton
        className="h-auto p-3 relative z-10 cursor-pointer"
        onClick={() => onOfferClick(offer)}
      >
        <div className="flex items-center gap-3 w-full">
          <ImageWithFallback
            key={nftData?.image_url || offer.id}
            src={nftData?.image_url || "/placeholder.svg"}
            alt={nftData?.metadata?.name || offer.contract || "NFT"}
            width={40}
            height={40}
            fallbackSrc="https://placehold.co/40x40/18181b/9f9fa9?text=No+Image"
            className="rounded-md"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {nftData?.metadata?.name ||
                offer.contract?.slice(0, 6) + "...#" + offer.tokenId}
            </div>
            <div className="text-xs text-muted-foreground">
              Offer: {offer.amount} IP
            </div>
          </div>
          <Badge
            {...getStatusBadgeProps(isExpired ? "expired" : offer.status)}
            className={cn("text-xs", getStatusBadgeProps(isExpired ? "expired" : offer.status).className)}
          >
            {isExpired ? "Expired" : offer.status}
          </Badge>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const ListOffer = () => {
  const { address } = useAccount();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<DisplayOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: offersData,
    isLoading: offersLoading,
    refetch: refetchOffers,
  } = useReadContract({
    address: GENEIP_MARKETPLACE_ADDRESS,
    abi: GENEIP_MARKETPLACE_ABI,
    functionName: "getOffersTo",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  const { data: selectedNftData } = useGetDetailNFT(
    selectedOffer?.contract || "",
    Number(selectedOffer?.tokenId || 0)
  );

  const offers: DisplayOffer[] = (
    (offersData || []) as unknown as ContractOffer[]
  ).map((offer) => ({
    id: offer.id?.toString() ?? "",
    offerer: offer.offerer,
    amount: offer.offerPrice
      ? (Number(offer.offerPrice) / 1e18).toString()
      : "0",
    timestamp: offer.expireAt?.toString() ?? "",
    expires_at: offer.expireAt?.toString() ?? "",
    status:
      typeof offer.status === "number"
        ? (["active", "accepted", "cancelled", "expired"][offer.status] as string)
        : "active",
    contract: offer.nft,
    tokenId: offer.tokenId,
  }))
  // Sort by timestamp descending (latest first)
  .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  const handleOfferClick = useCallback((offer: DisplayOffer) => {
    setSelectedOffer({ ...offer });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOffer(null);
  }, []);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm font-medium mb-3">
          <TrendingUp className="h-4 w-4 mr-2" />
          Active Offers {!offersLoading && `(${offers.length})`}
          {offersLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="relative">
            {offersLoading ? (
              <>
                <OfferSkeleton />
                <OfferSkeleton />
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
                {offers.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-xs">
                    No offers found
                  </div>
                ) : (
                  offers.map((offer, index) => (
                    <OfferItem
                      key={offer.id}
                      offer={offer}
                      index={index}
                      setHoveredItem={setHoveredItem}
                      onOfferClick={handleOfferClick}
                    />
                  ))
                )}
              </>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <OfferDetailModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        nftData={selectedNftData}
        refetchOffers={refetchOffers}
      />
    </>
  );
};

export default ListOffer;
