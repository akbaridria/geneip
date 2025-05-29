"use client";

import {
  Background,
  BackgroundVariant,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
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

import "@xyflow/react/dist/style.css";
import { CommandSearch } from "./components/command-search";

const App = () => {
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges] = useEdgesState([]);

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TomoEVMKitProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Toaster richColors closeButton />
            <DesktopRequired />
            <LoginForm />
            <div className="w-screen h-screen">
              <SidebarProvider>
                <div className="flex w-screen h-screen">
                  <AppSidebar />
                  <SidebarInset className="flex-1">
                    <CommandSearch />
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      fitView
                      contentEditable={false}
                      colorMode="dark"
                    >
                      <Background variant={BackgroundVariant.Dots} />
                    </ReactFlow>
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
