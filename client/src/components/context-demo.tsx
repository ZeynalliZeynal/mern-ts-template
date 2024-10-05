import Stack from "@/components/ui/stack.tsx";
import ContextMenu from "@/components/ui/context-menu.tsx";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { LuCommand } from "react-icons/lu";
import ContextMenuSub from "@/components/ui/context-menu/context-menu-sub.tsx";

export default function ContextDemo() {
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
          <ContextMenu.Group>
            <ContextMenu.Item onClick={() => console.log("go back")}>
              Back{" "}
              <div className="flex items-center gap-1">
                <span className="size-4">
                  <LuCommand />
                </span>
                <span>[</span>
              </div>
            </ContextMenu.Item>
            <ContextMenu.Item
              disabled
              onClick={() => console.log("go forward")}
            >
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
            <ContextMenu.Item onClick={() => console.log("reload")}>
              Reload
              <div className="flex items-center gap-1">
                <span className="size-4">
                  <LuCommand />
                </span>
                <span>R</span>
              </div>
            </ContextMenu.Item>
            <ContextMenuSub>
              <ContextMenuSub.Trigger>People</ContextMenuSub.Trigger>
              <ContextMenuSub.Content>
                <ContextMenu.Item
                  onClick={({ currentTarget }) =>
                    console.log(currentTarget.innerText)
                  }
                >
                  Telman
                </ContextMenu.Item>
                <ContextMenu.Item
                  onClick={({ currentTarget }) =>
                    console.log(currentTarget.innerText)
                  }
                >
                  Simran
                </ContextMenu.Item>
                <ContextMenu.Item
                  onClick={({ currentTarget }) =>
                    console.log(currentTarget.innerText)
                  }
                >
                  Samir
                </ContextMenu.Item>
                <ContextMenu.Item
                  onClick={({ currentTarget }) =>
                    console.log(currentTarget.innerText)
                  }
                >
                  Femil
                </ContextMenu.Item>
                <ContextMenu.Item
                  onClick={({ currentTarget }) =>
                    console.log(currentTarget.innerText)
                  }
                >
                  Josef
                </ContextMenu.Item>
              </ContextMenuSub.Content>
            </ContextMenuSub>
            <ContextMenu.Item
              onClick={(event) => console.log(event?.currentTarget.innerText)}
            >
              Zeynalli Zeynal
            </ContextMenu.Item>
          </ContextMenu.Group>
        </ContextMenu.Content>
      </ContextMenu>
    </Stack>
  );
}
