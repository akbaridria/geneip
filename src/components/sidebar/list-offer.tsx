import { TrendingUp, Loader2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

const offers = [
  {
    id: 1,
    name: "Crypto Punk #1234",
    image: "/placeholder.svg?height=40&width=40",
    offer: "2.1 IP",
    expires: "2h",
  },
  {
    id: 2,
    name: "Bored Ape #5678",
    image: "/placeholder.svg?height=40&width=40",
    offer: "15.5 IP",
    expires: "1d",
  },
];

const OfferSkeleton = () => (
  <SidebarMenuItem>
    <SidebarMenuButton className="h-auto p-3">
      <div className="flex items-center gap-3 w-full">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-28 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-8 rounded-full" />
      </div>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

const ListOffer = () => {
  const [offersLoading] = useState(false);
  return null;
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium mb-3">
        <TrendingUp className="h-4 w-4 mr-2" />
        Active Offers {!offersLoading && `(${offers.length})`}
        {offersLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {offersLoading ? (
            <>
              <OfferSkeleton />
              <OfferSkeleton />
            </>
          ) : (
            offers.map((offer) => (
              <SidebarMenuItem key={offer.id}>
                <SidebarMenuButton className="h-auto p-3">
                  <div className="flex items-center gap-3 w-full">
                    <img
                      src={offer.image || "/placeholder.svg"}
                      alt={offer.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {offer.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Offer: {offer.offer}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {offer.expires}
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

export default ListOffer;
