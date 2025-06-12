import type { Activity } from "@/types";
import { apiClient } from "../client";

const fetchSearchIpAsset = (ip: string) =>
  apiClient("local")
    .post("/search", { search: ip })
    .then((res) => res.data.results);

const fetchTrackById = (id: string) =>
  apiClient("local")
    .get(`/track/${id}`)
    .then((res) => res.data.results);

const fetchAllNFTs = (address: string) =>
  apiClient("blockscout")
    .get(`/addresses/${address}/nft`)
    .then((res) => res.data);

const fetchDetailNFT = (address: string, tokenId: string | number) =>
  apiClient("blockscout").get(`/tokens/${address}/instances/${tokenId}`);

const fetchCreatorOfNFT = (address: string) =>
  apiClient("blockscout").get(`/addresses/${address}`);

const fetchUpdateViews = (ipId: string) =>
  apiClient("local")
    .post(`/${ipId}/views`, {})
    .then((res) => res.data);

const fetchActivity = (nftContract: string, tokenId: string | number) =>
  apiClient("local")
    .get(`/activity/${nftContract}/${tokenId}`)
    .then((res) => res.data.results);

const fetchInsertActivity = (
  nftContract: string,
  tokenId: string | number,
  data: Activity
) =>
  apiClient("local")
    .post(`/activity/${nftContract}/${tokenId}`, { ...data })
    .then((res) => res.data.results);

export {
  fetchSearchIpAsset,
  fetchTrackById,
  fetchAllNFTs,
  fetchDetailNFT,
  fetchCreatorOfNFT,
  fetchUpdateViews,
  fetchActivity,
  fetchInsertActivity,
};
