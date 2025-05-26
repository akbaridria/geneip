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

import '@xyflow/react/dist/style.css';

const App = () => {
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges] = useEdgesState([]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-screen h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          fitView
          contentEditable={false}
          colorMode="dark"
        >
          <DesktopRequired />
          <LoginForm />

          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </ThemeProvider>
  );
};

export default App;
