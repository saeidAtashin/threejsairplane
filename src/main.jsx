import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PlayProvider } from "./contexts/Play";
import { Routes, HashRouter, Route } from "react-router-dom";
import App2 from "./App2";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PlayProvider>
      <HashRouter>
        <Routes>
          <Route path="/http" element={<App2 />} />
          <Route path="/" element={<App />} />
        </Routes>
      </HashRouter>
    </PlayProvider>
  </React.StrictMode>
);
