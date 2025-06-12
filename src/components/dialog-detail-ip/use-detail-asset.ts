import {
  useGetCreatorNFT,
  useGetDetailNFT,
  useGetIpAssetById,
} from "@/api/query";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { erc721Abi } from "viem";
import { GENEIP_MARKETPLACE_ABI } from "@/abis";
import { zeroAddress } from "viem";
import { formatEther } from "viem";
import { GENEIP_MARKETPLACE_ADDRESS, STATUS_OFFERS } from "@/config";
import type { Bid, BidStatus } from "@/types";

const useDetailAsset = (ipId: string) => {
  const [isListed, setIsListed] = useState(false);
  const [price, setPrice] = useState("");
  const [activeBids, setActiveBids] = useState<Bid[]>([]);
  const [highestBid, setHighestBid] = useState<Bid | null>(null);
  const [listBids, setListBids] = useState<Bid[]>([]);
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

  const { data: offersData } = useReadContract({
    address: GENEIP_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: GENEIP_MARKETPLACE_ABI,
    functionName: "getOffers",
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
    if (offersData) {
      const listBids = offersData.map((bid) => ({
        id: bid.id.toString(),
        bidder: bid.offerer,
        amount: formatEther(bid.offerPrice, "wei"),
        timestamp: bid.expireAt.toString(),
        avatar: bid.offerer,
        expires_at: bid.expireAt.toString(),
        status: STATUS_OFFERS?.[Number(bid.status)] as BidStatus,
      })).sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      const now = Math.floor(Date.now() / 1000);
      const listActiveBids = listBids.filter(
        (bid) => bid.status === "active" && Number(bid.timestamp) > now
      );
      setActiveBids(listActiveBids);
      setHighestBid(
        listActiveBids.reduce((max, bid) => {
          return Number(bid.amount) > Number(max.amount) ? bid : max;
        }, listActiveBids[0])
      );
      setListBids(listBids);
    }
  }, [offersData]);

  const { data: creatorData } = useGetCreatorNFT(
    nftData?.metadata?.tokenContract || ""
  );

  const { data: detailData } = useGetDetailNFT(
    nftData?.metadata?.tokenContract || "",
    nftData?.metadata?.tokenId || ""
  );

  return {
    metadata: nftData?.metadata,
    views: nftData?.views,
    owner: ownerData,
    isOwner: ownerData?.toLowerCase() === address?.toLowerCase(),
    isListed,
    price,
    refetchListing,
    activeBids,
    highestBid,
    creator: creatorData?.creator_address_hash,
    detail: detailData,
    listBids,
  };
};

export default useDetailAsset;
