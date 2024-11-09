import { Outlet } from "react-router-dom";
import Header from "@/layouts/main/header/header.tsx";
import Footer from "@/layouts/main/footer/footer.tsx";
import Breadcrumb from "@/components/ui/breadcrumb.tsx";
import DropdownMenu from "@/components/ui/dropdown-menu/dropdown-menu.tsx";
import { TbDots } from "react-icons/tb";

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <DropdownMenu>
              <DropdownMenu.Trigger className="flex items-center gap-1" asChild>
                <button className="size-3.5 hover:text-foreground transition-colors">
                  <TbDots />
                  <span className="sr-only">Toggle menu</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="horizontal-left-bottom">
                <DropdownMenu.Item>Documentation</DropdownMenu.Item>
                <DropdownMenu.Item>Themes</DropdownMenu.Item>
                <DropdownMenu.Item>GitHub</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/docs/components">
              Components
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
