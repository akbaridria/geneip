import { TrendingUp, Check } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useIpGraphStore } from "@/store";
import { Badge } from "./ui/badge";
import { useDetailIp } from "@/hooks/use-detail-ip";
import ImageSection from "./dialog-detail-ip/image-section";
import DetailAsset from "./dialog-detail-ip/detail-asset";

const DialogDetailIP = () => {
  const { isOpenDialogDetailIP, selectedAssetId, setIsOpenDialogDetailIP } =
    useIpGraphStore();
  const {
    isOwner,
    fixedPrice,
    fixedPriceUsd,
    newPrice,
    isPriceDialogOpen,
    activities,
    bids,
    activeBids,
    metadata,
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
        <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto bg-sidebar border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl text-foreground">
              {metadata?.name || "N/A"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Image Section */}
            <ImageSection />

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
                  <DetailAsset />
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
                                      {bid.status === "cancelled" && (
                                        <Badge
                                          variant="destructive"
                                          className="text-xs"
                                        >
                                          Rejected
                                        </Badge>
                                      )}
                                      {bid.status === "expired" && (
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
                                  {/* <p className="text-sm text-muted-foreground">
                                    {bid.amountUsd}
                                  </p> */}
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
