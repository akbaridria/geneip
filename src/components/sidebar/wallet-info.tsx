import { Wallet, Loader2, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import Avatar from "boring-avatars";

const walletData = {
  address: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e",
  balance: "2.45",
  avatar:
    "https://source.boringavatars.com/marble/120/0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e",
};

const WalletSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const WalletInfo = () => {
  const [walletLoading] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.address);
    toast("Address copied to clipboard", {
      description: "Wallet address copied to clipboard",
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (walletLoading) return <WalletSkeleton />;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium mb-3">
        <Wallet className="h-4 w-4 mr-2" />
        Wallet Connected
        {walletLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <Card className="p-0">
          <CardContent className="px-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar name={walletData.address} size={48} variant="beam" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    {truncateAddress(walletData.address)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={copyAddress}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-lg font-semibold">
                  {walletData.balance} ETH
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default WalletInfo;
