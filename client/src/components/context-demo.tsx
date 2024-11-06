import Stack from "@/components/ui/stack.tsx";
import ContextMenu from "@/components/ui/context-menu/context-menu.tsx";
import ContextMenuSub from "@/components/ui/context-menu/context-menu-sub-v2.tsx";

export default function ContextDemo() {
  return (
    <>
      <Stack>
        <ContextMenu>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item inset shortcut="⌘[">
              Back
            </ContextMenu.Item>
            <ContextMenu.Item inset disabled shortcut="⌘]">
              Forward
            </ContextMenu.Item>
            <ContextMenuSub>
              <ContextMenuSub.Trigger inset>More tools</ContextMenuSub.Trigger>
              <ContextMenuSub.Content>
                <ContextMenu.Item inset>Add friend</ContextMenu.Item>
                <ContextMenu.Item inset>Remove friend</ContextMenu.Item>
              </ContextMenuSub.Content>
            </ContextMenuSub>
            <ContextMenu.Item inset shortcut="⌘]">
              Reload
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
        {/*
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
                  <ContextMenu.Item
                    prefix={<MdOutlineAccountCircle />}
                    href="/account/profile"
                  >
                    Profile
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    prefix={<IoSettingsOutline />}
                    href="/account/settings"
                  >
                    Settings
                  </ContextMenu.Item>
                  <ContextMenu.Separator />
                  <ContextMenu.Group>
                    <ContextMenu.Item
                      prefix={<IoBookmarksOutline />}
                      href="/account/wishlist"
                    >
                      Wishlist
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      prefix={<AiOutlineProduct />}
                      href="/account/products"
                    >
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
                    toast(currentTarget.innerText)
                  }
                >
                  Telman
                </ContextMenu.Item>
                <ContextMenu.Item
                  onClick={({ currentTarget }) =>
                    toast(currentTarget.innerText)
                  }
                >
                  Simran
                </ContextMenu.Item>
                <ContextMenu.Item
                  onClick={({ currentTarget }) =>
                    toast(currentTarget.innerText)
                  }
                >
                  Samir
                </ContextMenu.Item>
                <ContextMenu.Item
                  onClick={({ currentTarget }) =>
                    toast(currentTarget.innerText)
                  }
                >
                  Femil
                </ContextMenu.Item>
                <ContextMenu.Item
                  onClick={({ currentTarget }) =>
                    toast(currentTarget.innerText)
                  }
                >
                  Josef
                </ContextMenu.Item>
              </ContextMenuSub.Content>
            </ContextMenuSub>
            <ContextMenu.Group>
              <ContextMenu.Item
                onClick={() => window.history.back()}
                inset
                suffix={<IoReturnDownBackOutline />}
                disabled
              >
                Back
              </ContextMenu.Item>
              <ContextMenu.Item
                onClick={() => window.history.forward()}
                inset
                suffix={<IoReturnDownForwardOutline />}
              >
                Forward
              </ContextMenu.Item>
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.Group>
              <ContextMenu.Item
                asChild
                inset
                suffix={<ArrowUpRight />}
                href="/account/dashboard"
              >
                Dashboard
              </ContextMenu.Item>
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.Group>
              <ContextMenu.Item
                onClick={() => window.location.reload()}
                inset
                suffix={<IoReload />}
              >
                Reload
              </ContextMenu.Item>
            </ContextMenu.Group>
          </ContextMenu.Content>
        </ContextMenu>

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
            <ContextMenu.Item>Test</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
        */}
      </Stack>
    </>
  );
}
