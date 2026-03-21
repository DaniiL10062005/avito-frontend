import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Ad } from "@/pages/ad/Ad";
import { EditAd } from "@/pages/edit-ad/EditAd";
import { Ads } from "@/pages/ads/Ads";

export const router = createBrowserRouter([
  {
    path: "/ads",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Ads />,
      },
      {
        path: ":id",
        element: <Outlet />,
        children: [
          { index: true, element: <Ad /> },
          { path: "edit", element: <EditAd /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/ads" replace />,
  },
]);
