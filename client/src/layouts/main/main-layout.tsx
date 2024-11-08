import { Outlet } from "react-router-dom";
import Header from "@/layouts/main/header/header.tsx";
import Footer from "@/layouts/main/footer/footer.tsx";

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
