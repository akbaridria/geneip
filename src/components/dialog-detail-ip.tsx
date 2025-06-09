import {
  Eye,
  Heart,
  Edit,
  ShoppingCart,
  Gavel,
  User,
  TrendingUp,
  Check,
} from "lucide-react";
import { ImageWithFallback } from "./image-with-fallback";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { useIpGraphStore } from "@/store";
import { Badge } from "./ui/badge";
import { useDetailIp } from "@/hooks/use-detail-ip";

const DialogDetailIP = () => {
  const { isOpenDialogDetailIP, selectedAssetId, setIsOpenDialogDetailIP } =
    useIpGraphStore();
  const {
    isLiked,
    isListed,
    isOwner,
    fixedPrice,
    fixedPriceUsd,
    bidAmount,
    newPrice,
    owner,
    isPriceDialogOpen,
    activities,
    bids,
    activeBids,
    highestBid,
    metadata,
    views,
    likes,
    setBidAmount,
    setNewPrice,
    setIsPriceDialogOpen,
    getActivityIcon,
    getActivityColor,
  } = useDetailIp(selectedAssetId || "");

  return (
    <>
      <Dialog
        open={isOpenDialogDetailIP}
        onOpenChange={setIsOpenDialogDetailIP}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl text-foreground">
              {metadata?.name || "N/A"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Image Section */}
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
                  <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? "fill-red-400 text-red-400" : ""
                      }`}
                    />
                    <span>{likes || 0} likes</span>
                  </button>
                </div>
              </div>

              {/* Owner Controls */}
              {isOwner && (
                <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <h3 className="font-semibold text-foreground">
                    Owner Controls
                  </h3>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="listing-toggle" className="text-foreground">
                      List for sale
                    </Label>
                    <Switch
                      id="listing-toggle"
                      checked={isListed}
                      // onCheckedChange={handleToggleListing}
                    />
                  </div>

                  {isListed && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Current price
                        </span>
                        <span className="font-medium">{fixedPrice} IP</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setIsPriceDialogOpen(true)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Update Price
                      </Button>
                    </div>
                  )}
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
                      <span className="font-bold text-lg">
                        {fixedPrice} IP
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        USD value
                      </span>
                      <span>{fixedPriceUsd}</span>
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                      // onClick={() => setIsBuyDialogOpen(true)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="lg:col-span-2">
              <Tabs
                defaultValue={isOwner ? "bids" : "details"}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="bids" className="relative">
                    Bids
                    {activeBids.length > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-purple-500">
                        {activeBids.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="relative">
                    Activity
                    {activities.length > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-blue-500">
                        {activities.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 mt-6">
                  {/* Price and Bid Section */}
                  {!isOwner && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                          {isListed
                            ? "Fixed Price"
                            : highestBid
                            ? "Highest Bid"
                            : "No Bids Yet"}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-foreground">
                            {isListed
                              ? `${fixedPrice} IP`
                              : highestBid
                              ? highestBid.amount
                              : "-"}
                          </span>
                          <span className="text-lg text-muted-foreground">
                            {isListed
                              ? fixedPriceUsd
                              : highestBid
                              ? highestBid.amountUsd
                              : ""}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="bid-amount" className="text-foreground">
                          Place a bid
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="bid-amount"
                            placeholder="Enter bid amount (IP)"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="flex-1 bg-background border-border"
                          />
                          <Button
                            //   onClick={handleBid}
                            disabled={!bidAmount}
                            className="px-6"
                          >
                            <Gavel className="w-4 h-4 mr-2" />
                            Bid
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator className="bg-border" />

                  {/* Creator and Owner Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">
                        Creator
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-foreground">N/A</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">
                        Owner
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-foreground">
                          {isOwner ? "You" : owner}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">
                      Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">N/A</p>
                  </div>

                  <Separator className="bg-border" />

                  {/* Properties */}
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">
                      Properties
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {/* {nftData.properties.map((property, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg p-3 text-center bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <p className="text-sm text-muted-foreground">
                          {property.trait}
                        </p>
                        <p className="font-medium text-foreground">
                          {property.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {property.rarity}
                        </p>
                      </div>
                    ))} */}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bids" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">
                        Bid History ({bids.length})
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span>{activeBids.length} active</span>
                      </div>
                    </div>

                    {bids.length === 0 ? (
                      <div className="p-8 text-center border border-dashed rounded-lg border-border">
                        <p className="text-muted-foreground">
                          No bids have been placed yet
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-3">
                          {bids.map((bid, index) => (
                            <div
                              key={bid.id}
                              className={`p-4 rounded-lg border transition-colors ${
                                bid.status === "active"
                                  ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20"
                                  : bid.status === "accepted"
                                  ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                                  : "border-border bg-muted/20"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                    {bid.avatar}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-foreground">
                                        {bid.bidder}
                                      </p>
                                      {index === 0 &&
                                        bid.status === "active" && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            Highest
                                          </Badge>
                                        )}
                                      {bid.status === "accepted" && (
                                        <Badge className="text-xs bg-green-500">
                                          Accepted
                                        </Badge>
                                      )}
                                      {bid.status === "rejected" && (
                                        <Badge
                                          variant="destructive"
                                          className="text-xs"
                                        >
                                          Rejected
                                        </Badge>
                                      )}
                                      {bid.status === "outbid" && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Outbid
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {bid.timestamp}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-foreground">
                                    {bid.amount}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {bid.amountUsd}
                                  </p>
                                </div>
                              </div>

                              {/* Owner Actions - Only show accept button */}
                              {isOwner && bid.status === "active" && (
                                <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                                  <Button
                                    size="sm"
                                    //   onClick={() => handleAcceptBid(bid.id)}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Accept Bid
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Activity History
                    </h3>

                    {activities.length === 0 ? (
                      <div className="p-8 text-center border border-dashed rounded-lg border-border">
                        <p className="text-muted-foreground">
                          No activity recorded yet
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-3">
                          {activities.map((activity) => {
                            const Icon = getActivityIcon(activity.type);
                            return (
                              <div
                                key={activity.id}
                                className="p-4 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-full bg-muted/30 ${getActivityColor(
                                      activity.type
                                    )}`}
                                  >
                                    {<Icon className="w-4 h-4" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium text-foreground">
                                          {activity.user}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {activity.timestamp}
                                        </p>
                                      </div>
                                      {activity.price && (
                                        <p className="font-bold text-foreground">
                                          {activity.price}
                                        </p>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {activity.details}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Listing Price</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-price">New Price (IP)</Label>
              <Input
                id="new-price"
                placeholder="Enter new price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Current price: {fixedPrice} IP ({fixedPriceUsd})
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPriceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={!newPrice}>Update Price</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogDetailIP;
