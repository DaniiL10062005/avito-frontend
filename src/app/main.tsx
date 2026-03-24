import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "@/app/router/router";
import "@/app/styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/shared/components/Sonner";

const root = document.getElementById("root")!;
const queryClient = new QueryClient();

ReactDOM.createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
