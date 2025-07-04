import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchActivity,
  fetchAllNFTs,
  fetchCreatorOfNFT,
  fetchDetailNFT,
  fetchInsertActivity,
  fetchSearchIpAsset,
  fetchTrackById,
  fetchUpdateViews,
} from "@/api/endpoints";
import type { Activity, IpAsset, NFT, Track } from "@/types";
import { queryKeys } from "../constant/query-keys";

export const useSearchIpAsset = () =>
  useMutation<IpAsset[], Error, string>({
    mutationFn: (search: string) => fetchSearchIpAsset(search),
  });

export const useTrackById = (id: string, enabled = !!id) =>
  useQuery<Track[], Error>({
    queryKey: queryKeys.trackById(id),
    queryFn: () => fetchTrackById(id),
    enabled,
  });

export const useGetIpAssetById = (id: string, enabled = !!id) =>
  useQuery<IpAsset | null, Error>({
    queryKey: queryKeys.ipAssetById(id),
    queryFn: () =>
      fetchSearchIpAsset(id).then((assets) => {
        return assets.length > 0 ? assets[0] : null;
      }),
    enabled,
  });

export const useGetAllNfts = (address: string, enabled = !!address) =>
  useQuery<NFT[], Error>({
    queryKey: queryKeys.getAllNftsByAddress(address),
    queryFn: () => fetchAllNFTs(address).then((res) => res.items),
    enabled,
  });

export const useGetDetailNFT = (
  address: string,
  tokenId: string | number,
  enabled = !!address
) =>
  useQuery<NFT, Error>({
    queryKey: queryKeys.getDetailNFT(address, tokenId),
    queryFn: () => fetchDetailNFT(address, tokenId).then((res) => res.data),
    enabled,
  });

export const useGetCreatorNFT = (address: string, enabled = !!address) =>
  useQuery<{ creator_address_hash: string }, Error>({
    queryKey: queryKeys.getCreatorNFT(address),
    queryFn: () => fetchCreatorOfNFT(address).then((res) => res.data),
    enabled,
  });

export const useUpdateViews = (ipId: string) =>
  useMutation<void, Error, string>({
    mutationFn: () => fetchUpdateViews(ipId),
  });

export const useInsertActivity = () =>
  useMutation<
    void,
    Error,
    { nftContract: string; tokenId: string | number; data: Activity }
  >({
    mutationFn: ({ nftContract, tokenId, data }) =>
      fetchInsertActivity(nftContract, tokenId, data),
  });

export const useGetActivity = (nftContract: string, tokenId: string | number) =>
  useQuery<Activity[], Error>({
    queryKey: queryKeys.getActivity(nftContract, tokenId),
    queryFn: () => fetchActivity(nftContract, tokenId),
    enabled: !!nftContract && !!tokenId,
  });
