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
  views?: number;
  likes?: number;
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

export type BidStatus = "active" | "accepted" | "rejected" | "outbid";
export type ActivityType =
  | "listing"
  | "bid_placed"
  | "bid_accepted"
  | "purchase"
  | "price_update"
  | "listing_canceled";

export interface Bid {
  id: string;
  bidder: string;
  amount: string;
  amountUsd: string;
  timestamp: string;
  avatar: string;
  status: BidStatus;
}

export interface Activity {
  id: string;
  type: ActivityType;
  user: string;
  avatar: string;
  timestamp: string;
  details: string;
  price?: string;
}
