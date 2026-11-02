import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Canvas camera={{ fov: 45, near: 0.1, far: 200, position: [0, 0, 40] }}>
      <App />
    </Canvas>
  </StrictMode>,
);
