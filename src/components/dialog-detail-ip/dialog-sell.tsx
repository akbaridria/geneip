"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Check,
  X,
  Loader2,
  Coins,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { erc721Abi, parseEther } from "viem";
import { GENEIP_MARKETPLACE_ABI } from "@/abis";
import { GENEIP_MARKETPLACE_ADDRESS } from "@/config";
import { useInsertActivity } from "@/api/query";
import { queryKeys } from "@/api/constant/query-keys";
import { useQueryClient } from "@tanstack/react-query";

type StepStatus = "pending" | "current" | "loading" | "completed" | "failed";

interface Step {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
}

interface DialogSellProps {
  nftContract: string;
  tokenId: string | number;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetchListing: () => void;
}

export const DialogSell = ({
  nftContract,
  tokenId,
  open,
  setOpen,
  refetchListing,
}: DialogSellProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [price, setPrice] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Approve NFT",
      description: "Approve the NFT to be sold on the marketplace",
      status: "current",
    },
    {
      id: 2,
      title: "List NFT",
      description: "Set your price and list the NFT for sale",
      status: "pending",
    },
    {
      id: 3,
      title: "Transaction Status",
      description: "Confirm the listing transaction",
      status: "pending",
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const {
    mutate: insertActivity,
    isSuccess,
    reset: resetInsertActivity,
  } = useInsertActivity();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getActivity(nftContract, tokenId),
      });
    }
  }, [isSuccess, nftContract, queryClient, tokenId]);

  // Helper to truncate error
  const getTruncatedError = (err: string | null) => {
    if (!err) return null;
    return err.length > 120 ? err.slice(0, 120) + "..." : err;
  };

  // 1. Check approval
  const { data: approvedAddress, refetch: refetchApproval } = useReadContract({
    address: nftContract as `0x${string}`,
    abi: erc721Abi,
    functionName: "getApproved",
    args: [BigInt(tokenId)],
    query: { enabled: open && !!nftContract && !!tokenId },
  });
  const isApproved =
    approvedAddress?.toLowerCase() === GENEIP_MARKETPLACE_ADDRESS.toLowerCase();

  // 2. Approve if needed
  const {
    writeContract: approve,
    data: approveHash,
    isPending: isApproving,
    error: approveError,
  } = useWriteContract();
  const { isSuccess: approveSuccess, isLoading: isConfirmingApprove } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  useEffect(() => {
    if (approveSuccess) {
      refetchApproval();
      updateStepStatus(1, "completed");
      updateStepStatus(2, "current");
      setCurrentStep(2);
    }
  }, [approveSuccess, refetchApproval]);

  // 3. List NFT
  const {
    writeContract: list,
    data: listHash,
    isPending: isListing,
    error: listError,
    reset: resetWriteContract,
  } = useWriteContract();
  const { isSuccess: listSuccess, isLoading: isConfirmingList } =
    useWaitForTransactionReceipt({
      hash: listHash,
    });

  useEffect(() => {
    if (listSuccess) {
      setTransactionHash(listHash ?? "");
      updateStepStatus(2, "completed");
      updateStepStatus(3, "completed");
      setCurrentStep(3);
      refetchListing();
      insertActivity({
        nftContract: nftContract?.toLowerCase() || "",
        tokenId,
        data: {
          id: "",
          type: "listing",
          user: address?.toLowerCase() || "",
          timestamp: new Date().toISOString(),
          details: `Listed for ${price} IP`,
          price,
        },
      });
    }
  }, [
    listSuccess,
    listHash,
    refetchListing,
    nftContract,
    tokenId,
    price,
    address,
    insertActivity,
  ]);

  useEffect(() => {
    if (approveError) {
      setError(approveError.message);
      updateStepStatus(1, "failed");
    } else if (listError) {
      setError(listError.message);
      updateStepStatus(2, "failed");
    } else {
      setError(null);
    }
  }, [approveError, listError]);

  const updateStepStatus = (stepId: number, status: StepStatus) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
  };

  const handleApprove = async () => {
    updateStepStatus(1, "loading");
    approve({
      address: nftContract as `0x${string}`,
      abi: erc721Abi,
      functionName: "approve",
      args: [GENEIP_MARKETPLACE_ADDRESS, BigInt(tokenId)],
    });
  };

  const handleList = async () => {
    if (!price || Number.parseFloat(price) <= 0) return;
    updateStepStatus(2, "loading");
    list({
      address: GENEIP_MARKETPLACE_ADDRESS,
      abi: GENEIP_MARKETPLACE_ABI,
      functionName: "list",
      args: [nftContract as `0x${string}`, BigInt(tokenId), parseEther(price)],
    });
  };

  const handleReset = useCallback(() => {
    // If approval failed, reset to step 1, else if listing failed, reset to step 2
    if (steps[0].status === "failed") {
      setCurrentStep(1);
      setSteps([
        { ...steps[0], status: "current" },
        { ...steps[1], status: "pending" },
        { ...steps[2], status: "pending" },
      ]);
    } else if (steps[1].status === "failed") {
      setCurrentStep(2);
      setSteps([
        { ...steps[0] },
        { ...steps[1], status: "current" },
        { ...steps[2], status: "pending" },
      ]);
    } else {
      setCurrentStep(1);
      setSteps([
        { ...steps[0], status: "current" },
        { ...steps[1], status: "pending" },
        { ...steps[2], status: "pending" },
      ]);
    }
    setPrice("");
    setTransactionHash("");
    setError(null);
  }, [steps]);

  const getStepIcon = (step: Step) => {
    switch (step.status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-400" />;
      case "failed":
        return <X className="h-4 w-4 text-red-400" />;
      case "loading":
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case "current":
        return <div className="h-2.5 w-2.5 bg-blue-400 rounded-full" />;
      default:
        return <div className="h-2.5 w-2.5 bg-zinc-600 rounded-full" />;
    }
  };

  // Reset state when dialog is closed
  const handleDialogChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      handleReset();
      setError(null);
      resetWriteContract();
      resetInsertActivity();
    },
    [handleReset, resetWriteContract, resetInsertActivity, setOpen]
  );

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md bg-sidebar border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-100">
            {listSuccess ? "NFT Listed Successfully" : "List Your NFT"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Follow the steps below to list your NFT on the marketplace
          </DialogDescription>
        </DialogHeader>

        <div>
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2",
                    step.status === "completed"
                      ? "bg-green-950 border-green-500"
                      : step.status === "failed"
                      ? "bg-red-950 border-red-500"
                      : step.status === "loading"
                      ? "bg-blue-950 border-blue-500"
                      : step.status === "current"
                      ? "bg-blue-950 border-blue-500"
                      : "bg-zinc-900 border-zinc-700"
                  )}
                >
                  {getStepIcon(step)}
                </div>
                {index < steps.length - 1 && (
                  <div className="h-8 w-0.5 bg-zinc-800" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "text-sm font-medium",
                    step.status === "current"
                      ? "text-blue-400"
                      : step.status === "completed"
                      ? "text-green-400"
                      : step.status === "failed"
                      ? "text-red-400"
                      : "text-zinc-400"
                  )}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <div className="w-full">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-zinc-400 bg-zinc-900/50 p-3 rounded-lg">
                  <Coins className="h-5 w-5 text-amber-500" />
                  <span>
                    You need to approve this NFT before listing it for sale
                  </span>
                </div>
                {isApproved ? (
                  <Button
                    onClick={() => {
                      updateStepStatus(1, "completed");
                      updateStepStatus(2, "current");
                      setCurrentStep(2);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    disabled={isApproving || isConfirmingApprove}
                  >
                    Continue to Listing
                  </Button>
                ) : (
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving || isConfirmingApprove}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    {isApproving || isConfirmingApprove ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      "Approve NFT"
                    )}
                  </Button>
                )}
                {error && (
                  <div
                    className="text-red-400 text-sm mt-2 bg-red-950/30 p-3 rounded-lg border border-red-900"
                    title={error}
                  >
                    {getTruncatedError(error)}
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-zinc-300 my-4">
                    Price (IP)
                  </Label>
                  <div className="relative">
                    <Input
                      id="price"
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="0.1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      disabled={isListing || isConfirmingList}
                      className="pl-10 bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Coins className="h-4 w-4 text-zinc-500" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm text-zinc-400 bg-zinc-900/50 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                  <span>Set your desired price in IP</span>
                </div>
                <Button
                  onClick={handleList}
                  disabled={
                    !price ||
                    Number.parseFloat(price) <= 0 ||
                    isListing ||
                    isApproving ||
                    isConfirmingApprove ||
                    isConfirmingList
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  {isListing || isConfirmingList ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Listing...
                    </>
                  ) : (
                    "List NFT"
                  )}
                </Button>
                {error && (
                  <div
                    className="text-red-400 text-sm mt-2 bg-red-950/30 p-3 rounded-lg border border-red-900"
                    title={error}
                  >
                    {getTruncatedError(error)}
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4 mt-4">
                {steps[2].status === "completed" ? (
                  <div className="text-center space-y-5">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-full bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-green-400">
                        Success!
                      </h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        Your NFT has been successfully listed for {price} IP
                      </p>
                    </div>
                    {transactionHash && (
                      <div className="border border-zinc-800 bg-zinc-900/50 p-4 rounded-lg">
                        <p className="text-xs text-zinc-500 mb-1">
                          Transaction Hash:
                        </p>
                        <p className="text-xs font-mono break-all text-zinc-300">
                          <a
                            href={`https://aeneid.storyscan.io/tx/${transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline"
                          >
                            {transactionHash}
                          </a>
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={() => handleDialogChange(false)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-5">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-full bg-red-900/30 flex items-center justify-center">
                        <X className="h-10 w-10 text-red-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-red-400">
                        Transaction Failed
                      </h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        There was an error listing your NFT. Please try again.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 rounded-md"
                        disabled={
                          isApproving ||
                          isListing ||
                          isConfirmingApprove ||
                          isConfirmingList
                        }
                      >
                        Try Again
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDialogChange(false)}
                        className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 rounded-md"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSell;
