import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SettingsProvider } from "./contexts/SettingsContext";

const renderApp = () => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    // Retry shortly if not found immediately (fallback for specific async loading scenarios)
    setTimeout(renderApp, 50);
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </React.StrictMode>,
  );
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderApp);
} else {
  renderApp();
}
