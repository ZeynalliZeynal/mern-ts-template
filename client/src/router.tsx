import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/main/main-layout.tsx";
import HomePage from "@/pages/home-page.tsx";
import ContextDemo from "@/components/context-demo.tsx";
import DropdownMenuDemo from "@/pages/dropdown-menu-demo.tsx";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/contextMenu",
        element: <ContextDemo />,
      },
      {
        path: "/dropdownMenu",
        element: <DropdownMenuDemo />,
      },
    ],
  },
]);
