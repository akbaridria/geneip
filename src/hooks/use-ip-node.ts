import { useEffect, useState } from "react";
import { erc721Abi, formatEther, zeroAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { GENEIP_MARKETPLACE_ABI } from "../abis";
import { GENEIP_MARKETPLACE_ADDRESS, STATUS_OFFERS } from "../config";
import type { Bid, BidStatus } from "@/types";
import { useGetIpAssetById } from "@/api/query";

const useIPNode = (
  ipId: string,
  nftContract: string,
  tokenId: string | number
) => {
  const [isListed, setIsListed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [owner, setOwner] = useState<`0x${string}` | undefined>(undefined);
  const [price, setPrice] = useState<string | null>(null);
  const [highestBid, setHighestBid] = useState<Bid | null>(null);
  const [activeBids, setActiveBids] = useState<Bid[]>([]);
  const [views, setViews] = useState(0);
  const { address } = useAccount();
  const { data: ipAssetData } = useGetIpAssetById(ipId);

  useEffect(() => {
    if (ipAssetData) {
      setViews(ipAssetData.views || 0);
    }
  }, [ipAssetData]);

  const { data: ownerData } = useReadContract({
    address: (nftContract || "") as `0x${string}`,
    abi: erc721Abi,
    functionName: "ownerOf",
    args: [BigInt(tokenId || 0)],
    query: {
      enabled: !!nftContract && !!tokenId,
    },
  });

  useEffect(() => {
    setOwner(ownerData);
    setIsOwner(ownerData?.toLowerCase() === address?.toLowerCase());
  }, [ownerData, address]);

  const { data: listingData } = useReadContract({
    address: GENEIP_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: GENEIP_MARKETPLACE_ABI,
    functionName: "listings",
    args: [nftContract as `0x${string}`, BigInt(tokenId || 0)],
    query: {
      enabled: !!nftContract && !!tokenId,
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
    args: [nftContract as `0x${string}`, BigInt(tokenId || 0)],
    query: {
      enabled: !!nftContract && !!tokenId,
    },
  });

  useEffect(() => {
    if (offersData) {
      const listActiveBids = offersData
        .filter((bid) => bid.expireAt > BigInt(Math.floor(Date.now() / 1000)))
        .map((bid) => ({
          id: bid.id.toString(),
          bidder: bid.offerer,
          amount: formatEther(bid.offerPrice, "wei"),
          timestamp: bid.expireAt.toString(),
          avatar: bid.offerer,
          expires_at: bid.expireAt.toString(),
          status: STATUS_OFFERS?.[Number(bid.status)] as BidStatus,
        }));
      setActiveBids(listActiveBids);
      setHighestBid(
        listActiveBids.reduce((max, bid) => {
          return Number(bid.amount) > Number(max.amount) ? bid : max;
        }, listActiveBids[0])
      );
    }
  }, [offersData]);

  return {
    isListed,
    isOwner,
    owner,
    price,
    highestBid,
    activeBids,
    views,
  };
};

export default useIPNode;
