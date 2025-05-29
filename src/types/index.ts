export interface Metadata {
  name: string;
  chainId: string;
  tokenId: string;
  imageUrl: string;
  tokenUri: string;
  tokenContract: string;
}

export interface IpAsset {
  id: number;
  asset_id: string;
  created_at: string;
  is_tracked: boolean;
  metadata: Metadata;
}
