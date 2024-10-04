import Button from "@/components/ui/button.tsx";
import ThemeSwitcher from "@/components/ui/theme.tsx";
import Spinner from "@/components/ui/spinner.tsx";
import Badge from "@/components/ui/badge.tsx";
import { ArrowDown, ThumbsUpIcon } from "lucide-react";
import Stack from "@/components/ui/stack.tsx";
import ContextDemo from "@/components/context-demo.tsx";
import ChoiceboxDemo from "@/components/choicebox-demo.tsx";
import ComboboxDemo from "@/components/combobox-demo.tsx";
import CollapseDemo from "@/components/collapse-demo.tsx";
import CheckboxDemo from "@/components/checkbox-demo.tsx";
import AvatarsDemo from "@/components/avatars-demo.tsx";

export default function HomePage() {
  return (
    <article className="flex flex-col w-full items-center gap-4">
      <Stack>
        <Button size="sm">Button</Button>
        <Button size="sm" primary prefix={<Spinner />} disabled>
          Disabled button
        </Button>
        <Button size="sm" primary>
          Primary button
        </Button>
      </Stack>
      <ThemeSwitcher />
      <Spinner size="md" />
      <Stack>
        <Badge size="md" icon={<ArrowDown />} style="purple-subtle">
          Badge
        </Badge>
        <Badge size="md" style="green" icon={<ThumbsUpIcon />}>
          Badge with icon
        </Badge>
      </Stack>
      <AvatarsDemo />
      <CheckboxDemo />
      <CollapseDemo />
      <ComboboxDemo />
      <ContextDemo />
      <ChoiceboxDemo />
    </article>
  );
}
