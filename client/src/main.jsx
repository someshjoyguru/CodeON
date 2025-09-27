import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createContext } from "react";
import "./App.css";

// export const server = "http://localhost:4000/api/v1";
export const server = "https://codeon-server.someshghosh.me/api/v1"

export const Context = createContext({ isAuthenticated: false });

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
      }}
    >
      <App />
    </Context.Provider>
  );
};

// Removed React.StrictMode to avoid double-invocation of effects (which was causing duplicate API calls in dev)
ReactDOM.createRoot(document.getElementById("root")).render(<AppWrapper />);
