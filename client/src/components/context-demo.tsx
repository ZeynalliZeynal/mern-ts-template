import Stack from "@/components/ui/stack.tsx";
import ContextMenu from "@/components/ui/context-menu.tsx";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { LuCommand } from "react-icons/lu";
import ContextMenuSub from "@/components/ui/context-menu/context-menu-sub.tsx";

export default function ContextDemo() {
  const navigate = useNavigate();

  return (
    <Stack>
      <ContextMenu>
        <ContextMenu.Trigger>
          <div
            style={{
              width: 300,
              padding: "45px 0",
              border: "1px hsla(var(--ds-gray-alpha-600)) dashed",
              borderRadius: 4,
              textAlign: "center",
              fontSize: 14,
            }}
          >
            Right click here
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenuSub>
            <ContextMenu.Group>
              <ContextMenu.Item onClick={() => navigate(-1)}>
                Back{" "}
                <div className="flex items-center gap-1">
                  <span className="size-4">
                    <LuCommand />
                  </span>
                  <span>[</span>
                </div>
              </ContextMenu.Item>
              <ContextMenu.Item disabled onClick={() => navigate(1)}>
                Forward
                <div className="flex items-center gap-1">
                  <span className="size-4">
                    <LuCommand />
                  </span>
                  <span>]</span>
                </div>
              </ContextMenu.Item>
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.Group>
              <ContextMenu.Item asChild>
                <Link to="/" className="cursor-pointer">
                  Dashboard{" "}
                  <span className="size-4">
                    <ArrowUpRight />
                  </span>
                </Link>
              </ContextMenu.Item>
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.Group>
              <ContextMenu.Item onClick={() => window.location.reload()}>
                Reload
                <div className="flex items-center gap-1">
                  <span className="size-4">
                    <LuCommand />
                  </span>
                  <span>R</span>
                </div>
              </ContextMenu.Item>
              <ContextMenuSub.Trigger>People</ContextMenuSub.Trigger>
              <ContextMenuSub.Content>
                <ContextMenu.Item>test</ContextMenu.Item>
              </ContextMenuSub.Content>
              <ContextMenu.Item
                onClick={(event) => console.log(event?.currentTarget.innerText)}
              >
                Zeynalli Zeynal
              </ContextMenu.Item>
            </ContextMenu.Group>
          </ContextMenuSub>
        </ContextMenu.Content>
      </ContextMenu>
    </Stack>
  );
}
