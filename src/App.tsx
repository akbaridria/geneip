"use client";

import LoginForm from "./components/login-form";
import DesktopRequired from "./components/desktop-required";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/sidebar";
import { TomoEVMKitProvider } from "@tomo-inc/tomo-evm-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./config";
import IpGraphWrapper from "./components/ip-graph";

import "@xyflow/react/dist/style.css";
import DialogDetailIP from "./components/dialog-detail-ip";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TomoEVMKitProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster richColors closeButton />
            <DesktopRequired />
            <LoginForm />
            <DialogDetailIP />
            <div className="w-screen h-screen">
              <SidebarProvider>
                <div className="flex w-screen h-screen">
                  <AppSidebar />
                  <SidebarInset className="flex-1">
                    <IpGraphWrapper />
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </div>
          </ThemeProvider>
        </TomoEVMKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
