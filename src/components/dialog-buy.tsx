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
  ipId,
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
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        onOpenChange(false);
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
        toast.success("Purchase successful");
        queryClient.invalidateQueries({
          queryKey: queryKeys.ipAssetById(ipId),
        });
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.getAllNftsByAddress(nftContract),
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.getDetailNFT(nftContract, tokenId),
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.getCreatorNFT(nftContract),
          });
        }, 1000);
      },
      onError: (error) => {
        toast.error(error.message || "Purchase failed");
      },
    },
  });
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

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
        {hash && (
          <div className="text-xs mt-2">
            Tx Hash:{" "}
            <a
              href={`https://aeneid.storyscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {hash}
            </a>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogBuy;
