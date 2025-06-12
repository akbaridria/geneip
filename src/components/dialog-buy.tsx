import type React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { GENEIP_MARKETPLACE_ABI } from "@/abis";
import { GENEIP_MARKETPLACE_ADDRESS } from "@/config";
import { parseEther } from "viem";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/constant/query-keys";
import { useInsertActivity } from "@/api/query";
import { useEffect } from "react";

interface DialogBuyProps {
  isOpen: boolean;
  nftName: string;
  fixedPrice: string;
  nftContract: string;
  tokenId: string | number;
  ipId: string;
  onOpenChange: (open: boolean) => void;
}

const DialogBuy: React.FC<DialogBuyProps> = ({
  isOpen,
  fixedPrice,
  nftName,
  nftContract,
  tokenId,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { mutate: insertActivity } = useInsertActivity();

  const {
    writeContract,
    data: hash,
    isPending,
    error,
    reset: resetWriteContract,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        insertActivity(
          {
            nftContract: nftContract?.toLowerCase() || "",
            tokenId,
            data: {
              id: "",
              type: "purchase",
              user: address?.toLowerCase() || "",
              timestamp: new Date().toISOString(),
              details: `Purchased ${nftName} for ${fixedPrice} IP`,
              price: fixedPrice,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: queryKeys.getActivity(
                  nftContract?.toLowerCase() || "",
                  tokenId
                ),
              });
            },
          }
        );
      },
      onError: (error) => {
        toast.error(error.message || "Purchase failed");
      },
    },
  });
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      onOpenChange(false);
      toast.success("Purchase successful");
      resetWriteContract();
      queryClient.invalidateQueries();
    }
  }, [isConfirmed, resetWriteContract, queryClient, onOpenChange]);

  const handleBuy = () => {
    writeContract({
      address: GENEIP_MARKETPLACE_ADDRESS,
      abi: GENEIP_MARKETPLACE_ABI,
      functionName: "buy",
      args: [nftContract as `0x${string}`, BigInt(tokenId)],
      value: parseEther(fixedPrice || "0"),
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-sidebar">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to purchase {nftName || "N/A"} for {fixedPrice} IP.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleBuy}
            disabled={isPending || isConfirming || isConfirmed}
          >
            {isPending || isConfirming
              ? "Processing..."
              : isConfirmed
              ? "Purchased!"
              : "Confirm Purchase"}
          </Button>
        </AlertDialogFooter>
        {error && (
          <div className="text-red-500 text-sm mt-2">{error.message}</div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogBuy;
