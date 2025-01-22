import ThemeSwitcher from "@/components/ui/theme.tsx";
import Spinner from "@/components/ui/spinner.tsx";
import Badge from "@/components/ui/badge.tsx";
import { ArrowDown, ThumbsUpIcon } from "lucide-react";
import Stack from "@/components/ui/stack.tsx";
import ContextDemo from "@/components/context-demo.tsx";
import ChoiceboxDemo from "@/components/choicebox-demo.tsx";
import CollapseDemo from "@/components/collapse-demo.tsx";
import CheckboxDemo from "@/components/checkbox-demo.tsx";
import AvatarsDemo from "@/components/avatars-demo.tsx";
import DropdownDemo from "@/components/dropdown-demo.tsx";
import PopoverDemo from "@/components/popover-demo.tsx";
import CommandDemo from "@/components/command-demo.tsx";
import DialogDemo from "@/components/dialog-demo.tsx";
import Copy from "@/components/ui/copy.tsx";
import ComboboxDemo from "@/components/combobox-demo.tsx";
import Tooltip from "@/components/ui/tooltip.tsx";
import TabsDemo from "@/components/tabs-demo.tsx";
import Input from "@/components/ui/input.tsx";
import Label from "@/label.tsx";
import Button from "@/components/ui/button.tsx";

const demoText = "This is a text, yo!";

export default function HomePage() {
  return (
    <article className="flex flex-col w-full items-center gap-4">
      <Stack>
        <Button size="sm">Button</Button>
        <Button size="sm" primary prefix={<Spinner />} disabled>
          Disabled button
        </Button>
        <Tooltip>
          <Tooltip.Trigger>
            <Button size="sm" primary>
              Primary button
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content align="vertical-right-center">test</Tooltip.Content>
        </Tooltip>
      </Stack>
      <ThemeSwitcher />
      <Spinner />
      <Stack>
        <Badge size="md" icon={<ArrowDown />} style="purple-subtle">
          Badge
        </Badge>
        <Badge size="md" style="green" icon={<ThumbsUpIcon />}>
          Badge with icon
        </Badge>
      </Stack>
      <TabsDemo />
      <Stack>
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" placeholder="Enter your name" />
      </Stack>
      <AvatarsDemo />
      <CheckboxDemo />
      <CollapseDemo />
      <ComboboxDemo />
      <Stack direction="row" align="center">
        {demoText}
        <Copy text={demoText}>Copy</Copy>
      </Stack>
      <ContextDemo />
      <DropdownDemo />
      <PopoverDemo />
      <DialogDemo />
      <CommandDemo />
      <ChoiceboxDemo />
    </article>
  );
}
