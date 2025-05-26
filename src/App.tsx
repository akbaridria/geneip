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

const App = () => {
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges] = useEdgesState([]);

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        fitView
        contentEditable={false}
      >
        
        <DesktopRequired />
        <LoginForm />

        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
};

export default App;
