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

export interface Track {
  parent_id: string;
  child_id: string;
  depth: number;
  child_metadata?: Metadata;
  parent_metadata?: Metadata;
}

export interface IpAssetNodeData {
  asset_id: string;
  metadata?: Metadata;
  [key: string]: unknown;
}
