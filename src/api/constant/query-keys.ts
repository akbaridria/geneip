export const queryKeys = {
  trackById: (id: string) => ["trackById", id],
  ipAssetById: (id: string) => ["ipAssetById", id],
  getAllNftsByAddress: (address: string) => ["getAllNftsByAddress", address],
  getDetailNFT: (address: string, tokenId: string | number) => [
    "getDetailNFT",
    address,
    tokenId,
  ],
  getCreatorNFT: (address: string) => ["getCreatorNFT", address],
};
