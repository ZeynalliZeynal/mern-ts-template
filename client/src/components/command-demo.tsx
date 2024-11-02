import Stack from "@/components/ui/stack.tsx";
import Command from "@/components/ui/command.tsx";
import { IoCalendarOutline } from "react-icons/io5";
import { BsEmojiLaughing } from "react-icons/bs";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { LuMail, LuSettings2, LuUser2 } from "react-icons/lu";

export default function CommandDemo() {
  return (
    <Stack>
      <Command className="min-w-96">
        <Command.Input placeholder="Type a command or search..." />
        <Command.Content>
          <Command.Group>
            <Command.Label>Suggestions</Command.Label>
            <Command.Item prefix={<IoCalendarOutline />}>Calendar</Command.Item>
            <Command.Item prefix={<BsEmojiLaughing />}>
              Search Emoji
            </Command.Item>
            <Command.Item disabled prefix={<HiOutlineRocketLaunch />}>
              Launch
            </Command.Item>
          </Command.Group>
          <Command.Separator />
          <Command.Group>
            <Command.Label>Settings</Command.Label>
            <Command.Item prefix={<LuUser2 />}>Profile</Command.Item>
            <Command.Item prefix={<LuMail />}>Mail</Command.Item>
            <Command.Item prefix={<LuSettings2 />}>Settings</Command.Item>
          </Command.Group>
        </Command.Content>
      </Command>
    </Stack>
  );
}
