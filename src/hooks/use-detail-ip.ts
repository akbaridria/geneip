import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { erc721Abi } from "viem";
import type { Activity, ActivityType, Bid } from "@/types";
import {
  AlertCircle,
  Check,
  Edit,
  Gavel,
  ShoppingCart,
  Tag,
  X,
} from "lucide-react";
import { useGetIpAssetById } from "@/api/query";

export const useDetailIp = (ipId: string) => {
  // Dialog states
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // Asset states
  const [isLiked, setIsLiked] = useState(false);
  const [isListed, setIsListed] = useState(false);
  const [fixedPrice, setFixedPrice] = useState("0.5");
  const [fixedPriceUsd] = useState("-");

  // Hardcoded data (to be replaced with API calls later)
  const activities: Activity[] = [];
  const bids: Bid[] = [];

  // Filtered data
  const activeBids = bids.filter((bid) => bid.status === "active");
  const highestBid = activeBids.length > 0 ? activeBids[0] : null;

  const { data: nftData } = useGetIpAssetById(ipId);

  // Ownership check
  const { address } = useAccount();
  const { data: owner } = useReadContract({
    address: (nftData?.metadata?.tokenContract || "") as `0x${string}`,
    abi: erc721Abi,
    functionName: "ownerOf",
    args: [BigInt(nftData?.metadata?.tokenId || 0)],
    query: {
      enabled:
        !!nftData?.metadata?.tokenContract && !!nftData?.metadata?.tokenId,
    },
  });

  const isOwner = address?.toLowerCase() === owner?.toLowerCase();

  // Handler functions
  const handleToggleListing = () => {
    setIsListed(!isListed);
    // Additional logic for listing the NFT on a marketplace
  };

  const handleUpdatePrice = (price: string) => {
    setFixedPrice(price);
    setIsPriceDialogOpen(false);
    // Additional logic for updating the price
  };

  const handleBid = () => {
    // Logic for placing a bid
    setBidAmount("");
  };

  const handleAcceptBid = (bidId: string) => {
    // Logic for accepting a bid
    console.log(`Accepting bid with ID: ${bidId}`);
  };

  const handleBuyNow = () => {
    // Logic for buying the NFT
    setIsBuyDialogOpen(false);
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    // Additional logic for liking the NFT
  };

  // Utility functions
  const getActivityIcon = (type: ActivityType) => {
    // This can be moved outside the hook or kept here for convenience
    switch (type) {
      case "listing":
        return Tag;
      case "bid_placed":
        return Gavel;
      case "bid_accepted":
        return Check;
      case "purchase":
        return ShoppingCart;
      case "price_update":
        return Edit;
      case "listing_canceled":
        return X;
      default:
        return AlertCircle;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case "listing":
        return "text-blue-500";
      case "bid_placed":
        return "text-purple-500";
      case "bid_accepted":
        return "text-green-500";
      case "purchase":
        return "text-amber-500";
      case "price_update":
        return "text-cyan-500";
      case "listing_canceled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return {
    // States
    isLiked,
    isListed,
    isOwner,
    fixedPrice,
    fixedPriceUsd,
    bidAmount,
    newPrice,
    owner,
    isPriceDialogOpen,
    isBuyDialogOpen,

    // Data
    activities,
    bids,
    activeBids,
    highestBid,
    ...nftData,

    // Setters
    setBidAmount,
    setNewPrice,
    setIsPriceDialogOpen,
    setIsBuyDialogOpen,

    // Handlers
    handleToggleListing,
    handleUpdatePrice,
    handleBid,
    handleAcceptBid,
    handleBuyNow,
    handleToggleLike,

    // Utils
    getActivityIcon,
    getActivityColor,
  };
};
