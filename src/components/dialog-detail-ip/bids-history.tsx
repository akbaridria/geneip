import { TrendingUp, Check } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import useDetailAsset from "./use-detail-asset";
import { useIpGraphStore } from "@/store";
import { truncateAddress } from "@/lib/utils";
import Avatar from "boring-avatars";
import { formatDistanceToNow } from "date-fns";

const BidsHistory = () => {
  const { selectedDetailAssetId } = useIpGraphStore();
  const { activeBids, listBids, isOwner } = useDetailAsset(selectedDetailAssetId || "");

  if (!activeBids) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading bids...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Bid History ({activeBids.length})
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>
            {activeBids.filter((b) => b.status === "active").length} active
          </span>
        </div>
      </div>

      {listBids.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-lg border-border">
          <p className="text-muted-foreground">No bids have been placed yet</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {listBids.map((bid, index) => (
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
                    <Avatar name={bid.avatar} size={48} variant="beam" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {truncateAddress(bid.bidder)}
                        </p>
                        {index === 0 && bid.status === "active" && (
                          <Badge variant="secondary" className="text-xs">
                            Highest
                          </Badge>
                        )}
                        {bid.status === "accepted" && (
                          <Badge className="text-xs bg-green-500">
                            Accepted
                          </Badge>
                        )}
                        {bid.status === "cancelled" && (
                          <Badge variant="destructive" className="text-xs">
                            Cancelled
                          </Badge>
                        )}
                        {bid.status === "expired" && (
                          <Badge variant="outline" className="text-xs">
                            Expired
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expires: {formatDistanceToNow(
                          new Date(Number(bid.timestamp) * 1000),
                          { addSuffix: true }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      {bid.amount || "-"} IP
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
  );
};

export default BidsHistory;
