import { Outlet } from "react-router-dom";
import Header from "@/layouts/main/header/header.tsx";
import Footer from "@/layouts/main/footer/footer.tsx";

export function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
