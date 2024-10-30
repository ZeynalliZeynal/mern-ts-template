import { RouterProvider } from "react-router-dom";
import { router } from "@/router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeSwitcher } from "@/context/theme-context.tsx";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeSwitcher>
          <RouterProvider router={router} />
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        </ThemeSwitcher>
      </QueryClientProvider>

      <Toaster richColors position="bottom-center" />
    </>
  );
}
