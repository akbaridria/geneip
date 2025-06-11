import { Gavel, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import useDetailAsset from "./use-detail-asset";
import { useIpGraphStore } from "@/store";
import { useState } from "react";
import { truncateAddress } from "@/lib/utils";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GENEIP_MARKETPLACE_ADDRESS } from "@/config";
import { GENEIP_MARKETPLACE_ABI } from "@/abis";
import { parseEther } from "viem";
import React from "react";

const DetailAsset = () => {
  const { selectedDetailAssetId } = useIpGraphStore();
  const { owner, isOwner, isListed, price, highestBid, creator, detail } =
    useDetailAsset(selectedDetailAssetId || "");

  return (
    <>
      {/* Price and Bid Section */}
      {!isOwner && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {isListed
                ? "Fixed Price"
                : highestBid
                ? "Highest Bid"
                : "No Bids Yet"}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {isListed
                  ? `${price} IP`
                  : highestBid
                  ? highestBid.amount
                  : "-"}
              </span>
            </div>
          </div>
          <BidSection
            nftContract={detail?.token?.address_hash}
            tokenId={detail?.id}
          />
        </div>
      )}

      <Separator className="bg-border" />

      {/* Creator and Owner Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground mb-2">Creator</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-foreground">
              {creator ? truncateAddress(creator) : "N/A"}
            </span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground mb-2">Owner</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-foreground">
              {isOwner ? "You" : owner ? truncateAddress(owner) : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-2 text-foreground">Description</h3>
        <p className="text-muted-foreground leading-relaxed">
          {detail?.metadata?.description || "N/A"}
        </p>
      </div>

      <Separator className="bg-border" />

      {/* Properties */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Properties</h3>
        <div className="grid grid-cols-2 gap-3">
          {detail?.metadata?.attributes?.map((property, index) => (
            <div
              key={index}
              className="border border-border rounded-lg p-3 text-center bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <p className="text-sm text-muted-foreground">
                {property.trait_type}
              </p>
              <p className="font-medium text-foreground">{property.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const BidSection = ({
  nftContract,
  tokenId,
}: {
  nftContract?: string;
  tokenId?: string | number;
}) => {
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [localTxHash, setLocalTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const {
    writeContract,
    isPending,
    error: wagmiError,
    data: txHash,
    reset: resetWriteContract,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: localTxHash,
  });

  const handleBid = () => {
    setError(null);
    setSuccess(false);
    setLocalTxHash(undefined);
    if (!nftContract || !tokenId || !bidAmount) return;
    const expireAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    writeContract({
      address: GENEIP_MARKETPLACE_ADDRESS,
      abi: GENEIP_MARKETPLACE_ABI,
      functionName: "makeOffer",
      args: [nftContract as `0x${string}`, BigInt(tokenId), BigInt(expireAt)],
      value: parseEther(bidAmount),
    });
  };

  // Set localTxHash when txHash changes
  React.useEffect(() => {
    if (txHash) {
      setLocalTxHash(txHash as `0x${string}`);
    }
  }, [txHash]);

  // Show success when tx is confirmed
  React.useEffect(() => {
    if (isSuccess) {
      setSuccess(true);
    }
  }, [isSuccess]);

  // Reset state on new bid or unmount
  React.useEffect(() => {
    return () => {
      setError(null);
      setSuccess(false);
      setLocalTxHash(undefined);
      resetWriteContract();
    };
  }, [resetWriteContract]);

  const isDisabled = isPending || isConfirming || success;

  return (
    <div className="space-y-3">
      <Label htmlFor="bid-amount" className="text-foreground">
        Place an offer
      </Label>
      <div className="flex gap-2">
        <Input
          id="bid-amount"
          placeholder="Enter bid amount (IP)"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="flex-1 bg-sidebar border-border min-w-[80%]"
          disabled={isDisabled}
        />
        <Button
          onClick={handleBid}
          disabled={!bidAmount || isDisabled}
          className="w-full"
        >
          <Gavel className="w-4 h-4" />
          {isPending || isConfirming
            ? "Placing..."
            : success
            ? "Offer Placed!"
            : "Place offer"}
        </Button>
      </div>
      {wagmiError && (
        <div className="text-red-500 text-sm mt-2" title={wagmiError.message}>
          {wagmiError.message.length > 120
            ? wagmiError.message.slice(0, 120) + "..."
            : wagmiError.message}
        </div>
      )}
      {error && (
        <div className="text-red-500 text-sm mt-2" title={error}>
          {error.length > 120 ? error.slice(0, 120) + "..." : error}
        </div>
      )}
      {localTxHash && (
        <div className="text-xs mt-2 break-all">Tx Hash: {localTxHash}</div>
      )}
    </div>
  );
};

export default DetailAsset;
