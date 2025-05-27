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

import "@xyflow/react/dist/style.css";
import AppSidebar from "./components/sidebar";

const App = () => {
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges] = useEdgesState([]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster richColors closeButton />
      <DesktopRequired />
      <LoginForm />
      <div className="w-screen h-screen">
        <SidebarProvider>
          <div className="flex w-screen h-screen">
            <AppSidebar />
            <SidebarInset className="flex-1">
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
  );
};

export default App;
