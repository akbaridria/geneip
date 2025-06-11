"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertTriangle, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { GENEIP_MARKETPLACE_ABI } from "@/abis";
import { GENEIP_MARKETPLACE_ADDRESS } from "@/config";
import { useInsertActivity } from "@/api/query";

interface UnlistNFTDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  nftContract: string;
  tokenId: string | number;
  nftName?: string;
  price?: string;
  refetchListing: () => void;
}

export const UnlistNFTDialog = ({
  open,
  nftContract,
  tokenId,
  nftName = "NFT",
  price = "-",
  setOpen,
  refetchListing,
}: UnlistNFTDialogProps) => {
  const [error, setError] = useState<string | null>(null);
  const [activityInserted, setActivityInserted] = useState(false);
  const { address } = useAccount();
  const {
    writeContract,
    data: txHash,
    isPending,
    error: wagmiError,
    reset: resetWriteContract,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const { mutate: insertActivity, reset: resetInsertActivity } =
    useInsertActivity();

  const handleUnlist = async () => {
    setError(null);
    writeContract({
      address: GENEIP_MARKETPLACE_ADDRESS,
      abi: GENEIP_MARKETPLACE_ABI,
      functionName: "unlist",
      args: [nftContract as `0x${string}`, BigInt(tokenId)],
    });
  };

  useEffect(() => {
    if (isSuccess && !activityInserted) {
      refetchListing();
      insertActivity({
        nftContract: nftContract?.toLowerCase() || "",
        tokenId,
        data: {
          id: "",
          type: "listing_canceled",
          user: address?.toLowerCase() || "",
          timestamp: new Date().toISOString(),
          details: `Unlisted at ${price} IP`,
          price: price,
        },
      });
      setActivityInserted(true);
    }
  }, [
    isSuccess,
    nftContract,
    tokenId,
    insertActivity,
    address,
    price,
    refetchListing,
    activityInserted,
  ]);

  // Helper to truncate error
  const getTruncatedError = (err: string | null) => {
    if (!err) return null;
    return err.length > 120 ? err.slice(0, 120) + "..." : err;
  };

  // Reset state when dialog is closed
  const handleDialogChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      resetWriteContract();
      resetInsertActivity();
      setError(null);
      setActivityInserted(false);
    },
    [setOpen, resetWriteContract, resetInsertActivity]
  );

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md bg-sidebar border-zinc-800 text-zinc-100">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-950/50 border border-amber-800">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-zinc-100">
                Unlist NFT from Sale
              </DialogTitle>
              <DialogDescription className="text-zinc-400 mt-1">
                Are you sure you want to remove this NFT from the marketplace?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* NFT Info Card */}
          <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🎨</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-zinc-100 text-lg">{nftName}</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Currently listed at{" "}
                  <span className="text-amber-400 font-medium">{price} IP</span>
                </p>
              </div>
            </div>
          </div>

          {/* Information List */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-zinc-300 mb-3">
              What happens when you unlist:
            </h4>
            <div className="space-y-2">
              {[
                "Your NFT will be removed from the marketplace",
                "Potential buyers will no longer see your listing",
                "You can relist it anytime in the future",
                "No fees will be charged for unlisting",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-sm text-zinc-400"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {(wagmiError || error) && (
            <div className="bg-red-950/30 border border-red-900 rounded-lg p-3">
              <p
                className="text-red-400 text-sm"
                title={wagmiError?.message || error || ""}
              >
                {getTruncatedError(wagmiError?.message || error)}
              </p>
            </div>
          )}

          {/* Transaction Hash */}
          {txHash && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3">
              <p className="text-xs text-zinc-500 mb-1">Transaction Hash:</p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono text-zinc-300 break-all flex-1">
                  {txHash}
                </p>
                <a
                  href={`https://aeneid.storyscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex-shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => handleDialogChange(false)}
            disabled={isPending || isConfirming}
            className="w-full sm:w-auto border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUnlist}
            disabled={isPending || isConfirming || isSuccess}
            variant="destructive"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Unlisting...
              </>
            ) : isSuccess ? (
              "Unlisted Successfully!"
            ) : (
              "Confirm Unlist"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnlistNFTDialog;
