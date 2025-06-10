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

export {
  fetchSearchIpAsset,
  fetchTrackById,
  fetchAllNFTs,
  fetchDetailNFT,
  fetchCreatorOfNFT,
};
