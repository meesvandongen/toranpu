import React from "react";
import { createRoot } from "react-dom/client";
import { Toranpu } from "./component";
import "./tailwind.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Toranpu />
  </React.StrictMode>,
);
