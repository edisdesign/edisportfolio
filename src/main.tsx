import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { PortfolioProvider } from "./app/context/PortfolioContext";

createRoot(document.getElementById("root")!).render(
  <PortfolioProvider>
    <App />
  </PortfolioProvider>
);