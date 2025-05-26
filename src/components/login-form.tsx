import { Wallet } from "lucide-react";
import React from "react";
import { ShineBorder } from "./magicui/shine-border";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";

const LoginForm = () => {
  return (
    <React.Fragment>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-15" />
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <Card className="relative overflow-hidden w-full max-w-md mx-4 pointer-events-auto">
          <ShineBorder
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            borderWidth={2}
          />
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-primary/10 rounded-full">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Connect Your Wallet
            </CardTitle>
            <CardDescription>
              Please connect your wallet to get started with the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button className="w-full h-12 text-lg font-medium">
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default LoginForm;
