import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Gavel,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import useDetailAsset from "./use-detail-asset";
import { useIpGraphStore } from "@/store";
import { useEffect, useState } from "react";
import { truncateAddress } from "@/lib/utils";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GENEIP_MARKETPLACE_ADDRESS } from "@/config";
import { GENEIP_MARKETPLACE_ABI } from "@/abis";
import { parseEther } from "viem";
import { Card, CardContent } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";

const DetailAsset = () => {
  const { selectedDetailAssetId } = useIpGraphStore();
  const { owner, isOwner, isListed, price, highestBid, creator, detail } =
    useDetailAsset(selectedDetailAssetId || "");

  return (
    <>
      {/* Price and Bid Section */}
      {!isOwner && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
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
  const [copied, setCopied] = useState(false);

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

  const copyTxHash = async () => {
    if (localTxHash) {
      await navigator.clipboard.writeText(localTxHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openExplorer = () => {
    if (localTxHash) {
      window.open(`https://aeneid.storyscan.io/tx/${localTxHash}`, "_blank");
    }
  };

  // Set localTxHash when txHash changes
  useEffect(() => {
    if (txHash) {
      setLocalTxHash(txHash as `0x${string}`);
    }
  }, [txHash]);

  // Show success when tx is confirmed
  useEffect(() => {
    if (isSuccess) {
      setSuccess(true);
    }
  }, [isSuccess]);

  // Reset state on new bid or unmount
  useEffect(() => {
    return () => {
      setError(null);
      setSuccess(false);
      setLocalTxHash(undefined);
      resetWriteContract();
    };
  }, [resetWriteContract]);

  const isDisabled = isPending || isConfirming || success;
  const currentError = wagmiError?.message || error;

  return (
    <Card className="bg-muted/30 border border-border/30 backdrop-blur-sm">
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-blue-400" />
            <Label
              htmlFor="bid-amount"
              className="text-lg font-semibold text-gray-100"
            >
              Place an Offer
            </Label>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            Your offer will expire in 7 days
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-3">
          <div className="relative">
            <Input
              id="bid-amount"
              type="number"
              step="0.001"
              placeholder="0.00"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 pr-12 h-12 text-lg focus:border-blue-500 focus:ring-blue-500/20"
              disabled={isDisabled}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Badge
                variant="secondary"
                className="bg-gray-700 text-gray-300 text-xs"
              >
                IP
              </Badge>
            </div>
          </div>

          <Button
            onClick={handleBid}
            disabled={!bidAmount || isDisabled}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 text-white font-medium transition-all duration-200 rounded-md"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Confirming Transaction...
              </>
            ) : isConfirming ? (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Waiting for Confirmation...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Offer Placed Successfully!
              </>
            ) : (
              <>
                <Gavel className="w-4 h-4 mr-2" />
                Place Offer
              </>
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {currentError && (
          <Alert className="border-red-800 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              <div className="font-medium mb-1">Transaction Failed</div>
              <div className="text-sm opacity-90">
                {currentError.length > 100
                  ? `${currentError.slice(0, 100)}...`
                  : currentError}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-800 bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              <div className="font-medium mb-1">Offer Placed Successfully!</div>
              <div className="text-sm opacity-90">
                Your offer has been submitted to the blockchain.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Transaction Hash */}
        {localTxHash && (
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Transaction Hash</Label>
            <div className="flex items-center gap-2 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
              <code className="flex-1 text-xs text-gray-300 font-mono break-all">
                {localTxHash}
              </code>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyTxHash}
                  className="h-8 w-8 p-0 hover:bg-gray-700 rounded-md"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openExplorer}
                  className="h-8 w-8 p-0 hover:bg-gray-700 rounded-md"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
            {copied && (
              <p className="text-xs text-green-400">Copied to clipboard!</p>
            )}
          </div>
        )}

        {/* Loading State Overlay */}
        {(isPending || isConfirming) && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
              <div className="text-sm text-gray-300">
                {isPending
                  ? "Confirm transaction in your wallet..."
                  : "Processing transaction..."}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailAsset;
