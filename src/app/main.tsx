import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "@/app/router/router";
import "@/app/styles/index.css";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
