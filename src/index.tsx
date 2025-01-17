import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App/App";

const OnlineStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div style={errorStyle}>
        <p>⚠️ You are offline. Please check your connection and try again.</p>
        <h4>Please close App and back again</h4>
      </div>
    );
  }

  return null;
};

const errorStyle: React.CSSProperties = {
  position: "fixed",
  height: "100%",
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: "black",
  color: "#fff",
  textAlign: "center",
  padding: "10px",
  fontSize: "16px",
  zIndex: 1000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "10px",
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <OnlineStatus />
    <App />
  </React.StrictMode>
);
