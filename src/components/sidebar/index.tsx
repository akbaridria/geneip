"use client";

import type * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Logo from "../logo";
import WalletInfo from "./wallet-info";
import ListIp from "./list-ip";
import ListOffer from "./list-offer";
import ListBids from "./list-bids";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="none" className="w-[375px]" {...props}>
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>

      <SidebarContent className="px-4">
        <WalletInfo />
        <ListIp />
        <ListOffer />
        <ListBids />

        <SidebarGroup>
          <SidebarGroupContent>
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Register Your IP
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-3">
                  Protect and monetize your intellectual property on the
                  blockchain.
                </p>
                <a
                  href="https://portal.story.foundation/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full" size="sm">
                    Register IP Now
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
