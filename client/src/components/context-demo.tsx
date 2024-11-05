import Stack from "@/components/ui/stack.tsx";
import ContextMenu from "@/components/ui/context-menu/context-menu-v2.tsx";

export default function ContextDemo() {
  return (
    <>
      <Stack>
        <ContextMenu>
          <ContextMenu.Trigger>
            <div className="min-w-72 min-h-32 flex items-center justify-center text-gray-800 rounded-ui-content border border-dashed">
              Right click here
            </div>
          </ContextMenu.Trigger>
          <ContextMenu.Content>test</ContextMenu.Content>
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
