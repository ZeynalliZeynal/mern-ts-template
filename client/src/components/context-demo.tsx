import Stack from "@/components/ui/stack.tsx";
import ContextMenu from "@/components/ui/context-menu/context-menu.tsx";
import { ArrowUpRight } from "lucide-react";
import ContextMenuSub from "@/components/ui/context-menu/context-menu-sub.tsx";
import { MdOutlineAccountCircle } from "react-icons/md";
import {
  IoBookmarksOutline,
  IoReload,
  IoReturnDownBackOutline,
  IoReturnDownForwardOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { AiOutlineProduct } from "react-icons/ai";
import { SiBurgerking } from "react-icons/si";

export default function ContextDemo() {
  return (
    <Stack>
      <ContextMenu>
        <ContextMenu.Trigger>
          <div
            style={{
              width: 300,
              padding: "45px 0",
              border: "1px hsla(var(--ds-gray-alpha-400)) dashed",
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
              <ContextMenu.Label prefix={<SiBurgerking />}>
                Burger KING
              </ContextMenu.Label>
              <ContextMenu.Separator />
              <ContextMenuSub.Trigger inset>
                Zeynalli Zeynal
              </ContextMenuSub.Trigger>
              <ContextMenuSub.Content>
                <ContextMenu.Item prefix={<MdOutlineAccountCircle />}>
                  Profile
                </ContextMenu.Item>
                <ContextMenu.Item prefix={<IoSettingsOutline />}>
                  Settings
                </ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Group>
                  <ContextMenu.Item prefix={<IoBookmarksOutline />}>
                    Wishlist
                  </ContextMenu.Item>
                  <ContextMenu.Item prefix={<AiOutlineProduct />}>
                    Products
                  </ContextMenu.Item>
                </ContextMenu.Group>
              </ContextMenuSub.Content>
            </ContextMenu.Group>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSub.Trigger inset>People</ContextMenuSub.Trigger>
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
          <ContextMenu.Group>
            <ContextMenu.Item
              onClick={() => console.log("go back")}
              inset
              suffix={<IoReturnDownBackOutline />}
            >
              Back
            </ContextMenu.Item>
            <ContextMenu.Item
              disabled
              onClick={() => console.log("go forward")}
              inset
              suffix={<IoReturnDownForwardOutline />}
            >
              Forward
            </ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item asChild inset suffix={<ArrowUpRight />} href="/">
              Dashboard
            </ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item
              onClick={() => console.log("reload")}
              inset
              suffix={<IoReload />}
            >
              Reload
            </ContextMenu.Item>
          </ContextMenu.Group>
        </ContextMenu.Content>
      </ContextMenu>
    </Stack>
  );
}
