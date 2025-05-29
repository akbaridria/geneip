import { Wallet } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { ShineBorder } from "./magicui/shine-border";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import Logo from "./logo";
import { useConnectModal } from "@tomo-inc/tomo-evm-kit";
import { useAccount, useSwitchChain } from "wagmi";
import { supportedChainIds } from "@/config";

const LoginForm = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (!isConnected || !chainId) return;

    if (!supportedChainIds.includes(chainId)) {
      switchChain({ chainId: supportedChainIds[0] });
    }
  }, [isConnected, chainId, switchChain]);

  const isRightConnected = useMemo(
    () => isConnected && supportedChainIds.includes(chainId || 0),
    [isConnected, chainId]
  );

  if (isRightConnected) return null;

  return (
    <React.Fragment>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xs z-15" />
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <Card className="relative overflow-hidden w-full max-w-md mx-4 pointer-events-auto">
          <ShineBorder
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            borderWidth={1}
          />
          <CardHeader className="space-y-1 text-center">
            <Logo />
            <CardTitle className="text-2xl font-bold">
              Connect Your Wallet
            </CardTitle>
            <CardDescription>
              Please connect your wallet to get started with the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              className="w-full h-12 text-lg font-medium"
              onClick={openConnectModal}
            >
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </Button>

            <div className="pt-2 border-t">
              <p className="text-xs text-center text-muted-foreground">
                Connect your wallet to explore the world of onchain IP — trace
                lineages, register your creations, and trade IP rights through
                bids or sales.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default LoginForm;
