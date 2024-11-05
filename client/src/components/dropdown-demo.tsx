import Stack from "@/components/ui/stack.tsx";
import DropdownMenu from "@/components/ui/dropdown-menu/dropdown-menu.tsx";
import {
  LuCloud,
  LuCreditCard,
  LuGithub,
  LuKeyboard,
  LuLogOut,
  LuPlus,
  LuSettings,
  LuUser,
  LuUsers,
} from "react-icons/lu";
import { HiOutlineSupport } from "react-icons/hi";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Spinner from "@/components/ui/spinner.tsx";

export default function DropdownDemo() {
  const [isPending, setIsPending] = useState(false);
  return (
    <Stack>
      <DropdownMenu>
        <DropdownMenu.Trigger>Samir Zeymurlu</DropdownMenu.Trigger>
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
            <DropdownMenu.Item
              prefix={<LuLogOut />}
              suffix={isPending ? <Spinner /> : null}
              onClick={async () => {
                setIsPending(true);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setIsPending(false);
              }}
            >
              Log out
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <button>Open second one</button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item prefix={<QuestionMarkCircledIcon />}>
            why not?
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </Stack>
  );
}
