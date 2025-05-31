import { Gavel, Loader2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

const bids = [
  {
    id: 1,
    name: "Art Collection #999",
    image: "/placeholder.svg?height=40&width=40",
    bid: "0.8 IP",
    status: "pending",
  },
  {
    id: 2,
    name: "Music NFT #123",
    image: "/placeholder.svg?height=40&width=40",
    bid: "0.4 IP",
    status: "outbid",
  },
];

const BidSkeleton = () => (
  <SidebarMenuItem>
    <SidebarMenuButton className="h-auto p-3">
      <div className="flex items-center gap-3 w-full">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

const ListBids = () => {
  const [bidsLoading] = useState(false);
  return null;
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium mb-3">
        <Gavel className="h-4 w-4 mr-2" />
        Your Bids {!bidsLoading && `(${bids.length})`}
        {bidsLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {bidsLoading ? (
            <>
              <BidSkeleton />
              <BidSkeleton />
            </>
          ) : (
            bids.map((bid) => (
              <SidebarMenuItem key={bid.id}>
                <SidebarMenuButton className="h-auto p-3">
                  <div className="flex items-center gap-3 w-full">
                    <img
                      src={bid.image || "/placeholder.svg"}
                      alt={bid.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {bid.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bid: {bid.bid}
                      </div>
                    </div>
                    <Badge
                      variant={
                        bid.status === "pending" ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {bid.status}
                    </Badge>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default ListBids;
