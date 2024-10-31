import Stack from "@/components/ui/stack.tsx";
import DropdownMenu from "@/components/ui/dropdown-menu/dropdown-menu.tsx";
import {
  LuCloud,
  LuCreditCard,
  LuGithub,
  LuKeyboard,
  LuLogOut,
  LuMail,
  LuMessageSquare,
  LuPlus,
  LuPlusCircle,
  LuSettings,
  LuUser,
  LuUserPlus,
  LuUsers,
} from "react-icons/lu";
import DropdownMenuSub from "@/components/ui/dropdown-menu/dropdown-menu-sub.tsx";
import { HiOutlineSupport } from "react-icons/hi";

export default function DropdownDemo() {
  return (
    <Stack>
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>My Account</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item prefix={<LuUser />} shortcut="⇧⌘P">
              Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item prefix={<LuCreditCard />} shortcut="⌘B">
              Billing
            </DropdownMenu.Item>
            <DropdownMenu.Item prefix={<LuSettings />} shortcut="⌘S">
              Settings
            </DropdownMenu.Item>
            <DropdownMenu.Item prefix={<LuKeyboard />} shortcut="⌘K">
              Keyboard shortcuts
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item prefix={<LuUsers />} shortcut="⇧⌘P">
              Team
            </DropdownMenu.Item>
            <DropdownMenuSub>
              <DropdownMenuSub.Trigger prefix={<LuUserPlus />}>
                Invite users
              </DropdownMenuSub.Trigger>
              <DropdownMenuSub.Content>
                <DropdownMenu.Group>
                  <DropdownMenu.Item prefix={<LuMail />}>
                    Email
                  </DropdownMenu.Item>
                  <DropdownMenu.Item prefix={<LuMessageSquare />}>
                    Message
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Separator />
                <DropdownMenu.Group>
                  <DropdownMenu.Item prefix={<LuPlusCircle />}>
                    More...
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
              </DropdownMenuSub.Content>
            </DropdownMenuSub>
            <DropdownMenu.Item prefix={<LuPlus />} shortcut="⌘T">
              New team
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item prefix={<LuGithub />}>Github</DropdownMenu.Item>
            <DropdownMenu.Item prefix={<HiOutlineSupport />}>
              Support
            </DropdownMenu.Item>
            <DropdownMenu.Item prefix={<LuCloud />} disabled>
              Api
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item prefix={<LuLogOut />}>Log out</DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>
    </Stack>
  );
}
