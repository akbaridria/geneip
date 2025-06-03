import { Tag, ShoppingCart, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ImageWithFallback } from "../image-with-fallback";
import type { IpAssetNodeData } from "@/types";
import { type NodeProps, type Node, Handle, Position } from "@xyflow/react";
import { useDetailIp } from "@/hooks/use-detail-ip";
import { truncateAddress } from "@/lib/utils";
import { ShineBorder } from "../magicui/shine-border";
import { useIpGraphStore } from "@/store";

type IpAssetNodeType = Node<IpAssetNodeData, "ipAsset">;

const IpAssetNode: React.FC<NodeProps<IpAssetNodeType>> = ({
  data: nftData,
}) => {
  const {
    isListed,
    isOwner,
    fixedPrice,
    fixedPriceUsd,
    isBuyDialogOpen,
    activeBids,
    highestBid,
    owner,
    views,
    likes,
    isLiked,
    setIsBuyDialogOpen,
  } = useDetailIp(nftData?.asset_id);
  const { selectedAssetId, setIsOpenDialogDetailIP } = useIpGraphStore();

  return (
    <div className="w-full min-w-[390px] max-w-[400px]">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-primary border-2 border-background z-10"
      />
      <Card className="group relative overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 bg-sidebar backdrop-blur-sm py-0">
        {selectedAssetId?.toLowerCase() === nftData?.asset_id.toLowerCase() && (
          <ShineBorder
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            borderWidth={1}
          />
        )}
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden">
            <ImageWithFallback
              src={nftData?.metadata?.imageUrl || "/placeholder.svg"}
              alt={nftData?.metadata?.name || "NFT Image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-100 p-1 rounded-xl"
            />
            {isOwner && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-green-500/90 text-white border-0 backdrop-blur-sm text-base rounded-full">
                  Owner
                </Badge>
              </div>
            )}
            {isListed && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-blue-500/90 text-white border-0 backdrop-blur-sm text-base rounded-full">
                  <Tag className="w-3 h-3 mr-1" />
                  Listed
                </Badge>
              </div>
            )}
            {!isListed && (
              <div className="absolute top-3 right-3">
                <Badge
                  variant="secondary"
                  className="bg-purple-500/90 text-white border-0 backdrop-blur-sm text-base rounded-full"
                >
                  {activeBids.length} bid{activeBids.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            )}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end m-1">
              <div className="w-full p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{views || 0}</span>
                    </div>
                    <button
                      //   onClick={(e) => {
                      //     e.stopPropagation();
                      //     setIsLiked(!isLiked);
                      //   }}
                      className="flex items-center gap-1 hover:text-red-400 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked ? "fill-red-400 text-red-400" : ""
                        }`}
                      />
                      <span>{likes || 0}</span>
                    </button>
                  </div>
                </div>

                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => setIsOpenDialogDetailIP(true)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">
                {nftData.metadata?.name
                  ? (() => {
                      const name = nftData.metadata.name;
                      const match = name.match(/^\d+:\s*([^#]+)\s*#\d+$/);
                      return match ? match[1].trim() : name;
                    })()
                  : "N/A"}
              </p>
              <h3
                className="font-semibold text-xl leading-tight text-foreground truncate"
                title={nftData.metadata?.name || "N/A"}
              >
                {nftData.metadata?.name || "N/A"}
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                {isListed ? (
                  <>
                    <p className="text-sm text-muted-foreground">Fixed Price</p>
                    <p className="font-bold text-lg text-foreground">
                      {fixedPrice} IP
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fixedPriceUsd}
                    </p>
                  </>
                ) : highestBid ? (
                  <>
                    <p className="text-sm text-muted-foreground">Highest bid</p>
                    <p className="font-bold text-lg text-foreground">
                      {highestBid.amount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {highestBid.amountUsd}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">No bids yet</p>
                    <p className="font-bold text-lg text-foreground">-</p>
                  </>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {isOwner ? "You own this" : "Owner"}
                </p>
                <p className="font-medium text-foreground">
                  {isOwner ? "You" : truncateAddress(owner || "")}
                </p>
              </div>
            </div>
            {isListed && !isOwner && (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setIsBuyDialogOpen(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now for {fixedPrice} IP
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
        <AlertDialogContent className="bg-sidebar">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to purchase {nftData.metadata?.name || "N/A"} for{" "}
              {fixedPrice} IP. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsBuyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary">Confirm Purchase</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-primary border-2 border-background z-10"
      />
    </div>
  );
};

export default IpAssetNode;
