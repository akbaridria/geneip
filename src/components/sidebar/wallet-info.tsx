import { Wallet, Loader2, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import Avatar from "boring-avatars";
import { useAccount, useBalance } from "wagmi";
import { useMemo } from "react";
import { formatEther } from "viem";
import { copyAddress, truncateAddress } from "@/lib/utils";

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
  const { address } = useAccount();
  const { data, isLoading: walletLoading } = useBalance({ address });

  const walletData = useMemo(() => {
    return {
      address: address || "-",
      balance: data?.value ? formatEther(data?.value || 0n, "wei") : "-",
    };
  }, [address, data]);

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
                    {truncateAddress(walletData.address || "")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyAddress(walletData.address || "")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-lg font-semibold">
                  {walletData.balance} IP
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
