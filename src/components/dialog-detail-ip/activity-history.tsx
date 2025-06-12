import type { ActivityType } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import {
  AlertCircle,
  Edit,
  ShoppingCart,
  Tag,
  X,
  Gavel,
  Check,
} from "lucide-react";
import { useIpGraphStore } from "@/store";
import useDetailAsset from "./use-detail-asset";
import { useGetActivity } from "@/api/query";
import { formatDistanceToNow } from "date-fns";
import { truncateAddress } from "@/lib/utils";

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "listing":
      return Tag;
    case "bid_placed":
      return Gavel;
    case "bid_accepted":
      return Check;
    case "purchase":
      return ShoppingCart;
    case "price_update":
      return Edit;
    case "listing_canceled":
      return X;
    default:
      return AlertCircle;
  }
};

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case "listing":
      return "text-blue-500";
    case "bid_placed":
      return "text-purple-500";
    case "bid_accepted":
      return "text-green-500";
    case "purchase":
      return "text-amber-500";
    case "price_update":
      return "text-cyan-500";
    case "listing_canceled":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const ActivityHistory = () => {
  const { selectedDetailAssetId } = useIpGraphStore();
  const { metadata } = useDetailAsset(selectedDetailAssetId || "");
  const contract = metadata?.tokenContract || "";
  const tokenId = metadata?.tokenId || "";
  const {
    data: activities = [],
    isLoading,
    error,
  } = useGetActivity(contract?.toLowerCase() || "", tokenId);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading activity...
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load activity
      </div>
    );
  }

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Activity History
      </h3>

      {sortedActivities.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-lg border-border">
          <p className="text-muted-foreground">No activity recorded yet</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {sortedActivities.map((activity) => {
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
                            {truncateAddress(activity.user)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.timestamp), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {activity.price && (
                          <p className="font-bold text-foreground">
                            {activity.price ? activity.price + " IP" : "-"}
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
  );
};

export default ActivityHistory;
