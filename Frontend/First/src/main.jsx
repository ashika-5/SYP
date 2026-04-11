import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root")); // must match index.html id
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

