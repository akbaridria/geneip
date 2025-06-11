import { useGetIpAssetById } from "@/api/query";
import { erc721Abi, formatEther, zeroAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { GENEIP_MARKETPLACE_ABI } from "@/abis";
import { GENEIP_MARKETPLACE_ADDRESS } from "@/config";

const useImageSection = (ipId: string) => {
  const [isListed, setIsListed] = useState(false);
  const [price, setPrice] = useState("");
  const { data: nftData } = useGetIpAssetById(ipId);
  const { address } = useAccount();
  const { data: ownerData } = useReadContract({
    address: (nftData?.metadata?.tokenContract || "") as `0x${string}`,
    abi: erc721Abi,
    functionName: "ownerOf",
    args: [BigInt(nftData?.metadata?.tokenId || 0)],
    query: {
      enabled:
        !!nftData?.metadata?.tokenContract && !!nftData?.metadata?.tokenId,
    },
  });

  const { data: listingData, refetch: refetchListing } = useReadContract({
    address: GENEIP_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: GENEIP_MARKETPLACE_ABI,
    functionName: "listings",
    args: [
      (nftData?.metadata?.tokenContract || "") as `0x${string}`,
      BigInt(nftData?.metadata?.tokenId || 0),
    ],
    query: {
      enabled:
        !!nftData?.metadata?.tokenContract && !!nftData?.metadata?.tokenId,
    },
  });

  useEffect(() => {
    if (listingData) {
      setIsListed(listingData[0] !== zeroAddress);
      setPrice(formatEther(listingData?.[1] || 0n, "wei"));
    }
  }, [listingData]);

  return {
    metadata: nftData?.metadata,
    views: nftData?.views,
    owner: ownerData,
    isOwner: ownerData?.toLowerCase() === address?.toLowerCase(),
    isListed,
    price,
    refetchListing,
  };
};

export default useImageSection;
