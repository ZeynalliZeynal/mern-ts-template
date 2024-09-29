import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/main/main-layout.tsx";
import HomePage from "@/pages/home-page.tsx";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
