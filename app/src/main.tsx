import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { installGrain } from "./lib/grain";
import "./styles/global.css";

installGrain();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
