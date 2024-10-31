import Stack from "@/components/ui/stack.tsx";
import { ArrowUpRight } from "lucide-react";
import {
  IoReload,
  IoReturnDownBackOutline,
  IoReturnDownForwardOutline,
} from "react-icons/io5";
import DropdownMenu from "@/components/ui/dropdown-menu/dropdown-menu.tsx";

export default function DropdownDemo() {
  return (
    <Stack>
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              onClick={() => window.history.back()}
              inset
              suffix={<IoReturnDownBackOutline />}
              disabled
            >
              Back
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => window.history.forward()}
              inset
              suffix={<IoReturnDownForwardOutline />}
            >
              Forward
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item
              asChild
              inset
              suffix={<ArrowUpRight />}
              href="/account/dashboard"
            >
              Dashboard
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item
              onClick={() => window.location.reload()}
              inset
              suffix={<IoReload />}
            >
              Reload
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu>
    </Stack>
  );
}
