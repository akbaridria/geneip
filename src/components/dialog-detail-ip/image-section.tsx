import { ImageWithFallback } from "@/components/image-with-fallback";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye, ShoppingCart } from "lucide-react";
import useImageSection from "./use-image-section";
import { useIpGraphStore } from "@/store";
import { useCallback, useState } from "react";
import DialogBuy from "../dialog-buy";
import UnlistNFTDialog from "./dialog-unlist";
import DialogSell from "./dialog-sell";

const ImageSection = () => {
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [isUnlistDialogOpen, setIsUnlistDialogOpen] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const { selectedDetailAssetId } = useIpGraphStore();
  const { metadata, views, isOwner, isListed, price, refetchListing } = useImageSection(
    selectedDetailAssetId || ""
  );

  const handleSwitchListing = useCallback(() => {
    if (isListed) {
      setIsUnlistDialogOpen(true);
    } else {
      setIsSellDialogOpen(true);
    }
  }, [isListed]);

  return (
    <>
      <div className="lg:col-span-1 space-y-4">
        <div className="aspect-square relative rounded-lg overflow-hidden border border-border/50">
          <ImageWithFallback
            src={metadata?.imageUrl || "/placeholder.svg"}
            alt={metadata?.name || "NFT Image"}
            fallbackSrc="https://placehold.co/400x400/18181b/9f9fa9?text=No+Image"
            fill
            className="object-cover"
          />
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{views} views</span>
            </div>
          </div>
        </div>

        {/* Owner Controls */}
        {isOwner && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border/50">
            <h3 className="font-semibold text-foreground">Owner Controls</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="listing-toggle" className="text-foreground">
                List for sale
              </Label>
              <Switch
                id="listing-toggle"
                checked={isListed}
                onCheckedChange={handleSwitchListing}
              />
            </div>
          </div>
        )}

        {/* Buy Now (for non-owners) */}
        {isListed && !isOwner && (
          <div className="space-y-3 p-4 rounded-lg bg-blue-950/20 border border-blue-800/50">
            <h3 className="font-semibold text-foreground">Buy Now</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Fixed price
                </span>
                <span className="font-bold text-lg">{price} IP</span>
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setIsBuyDialogOpen(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>
        )}
      </div>
      <DialogBuy
        ipId={selectedDetailAssetId || ""}
        isOpen={isBuyDialogOpen}
        onOpenChange={setIsBuyDialogOpen}
        nftName={metadata?.name || ""}
        fixedPrice={price}
        nftContract={metadata?.tokenContract || ""}
        tokenId={metadata?.tokenId || ""}
      />
      <UnlistNFTDialog
        open={isUnlistDialogOpen}
        setOpen={setIsUnlistDialogOpen}
        nftContract={metadata?.tokenContract || ""}
        tokenId={metadata?.tokenId || ""}
        nftName={metadata?.name || ""}
        price={price}
        refetchListing={refetchListing}
      />
      <DialogSell
        open={isSellDialogOpen}
        setOpen={setIsSellDialogOpen}
        nftContract={metadata?.tokenContract || ""}
        tokenId={metadata?.tokenId || ""}
        refetchListing={refetchListing}
      />
    </>
  );
};

export default ImageSection;
