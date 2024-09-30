import Button from "@/components/ui/button.tsx";
import ThemeSwitcher from "@/components/ui/theme.tsx";
import Spinner from "@/components/ui/spinner.tsx";
import Badge from "@/components/ui/badge.tsx";
import { ArrowDown, ThumbsUpIcon } from "lucide-react";
import AvatarGroup from "@/components/ui/avatar-group.tsx";
import Checkbox from "@/components/ui/checkbox.tsx";
import { useState } from "react";
import ChoiceboxGroup from "@/components/ui/choicebox.tsx";

const avatars = [
  {
    username: "zeynal",
    avatar: "https://vercel.com/api/www/avatar?u=evilrabbit&s=64",
  },
  {
    username: "femil",
    avatar: "https://vercel.com/api/www/avatar?u=rauchg&s=64",
  },
  {
    username: "negrito",
    avatar: "https://vercel.com/api/www/avatar?u=leerob&s=64",
  },
  {
    username: "elmar",
    avatar: "https://vercel.com/api/www/avatar?u=sambecker&s=64",
  },
  {
    username: "josef",
    avatar: "https://vercel.com/api/www/avatar?u=rauno&s=64",
  },
  {
    username: "samir",
    avatar: "https://vercel.com/api/www/avatar?u=shuding&s=64",
  },
];

export default function HomePage() {
  const [checked, setChecked] = useState<boolean>(false);
  const [choice, setChoice] = useState<string>("trial");
  const [choices, setChoices] = useState([] as string[]);

  return (
    <article className="flex flex-col w-full items-center gap-4">
      <Button size="sm">Button</Button>
      <Button size="sm" primary prefix={<Spinner />} disabled>
        Disabled button
      </Button>
      <Button size="sm" primary>
        Primary button
      </Button>
      <ThemeSwitcher />
      <Spinner size="md" />
      <Badge size="md" icon={<ArrowDown />} style="purple-subtle">
        Badge
      </Badge>
      <Badge size="md" style="green" icon={<ThumbsUpIcon />}>
        Badge with icon
      </Badge>
      <AvatarGroup members={avatars} size={32} limit={4} />
      <Checkbox
        checked={checked}
        onChange={() => setChecked((prevState) => !prevState)}
      >
        Checkbox
      </Checkbox>
      <Checkbox disabled>Disabled Checkbox</Checkbox>
      <ChoiceboxGroup label="Radio group" value={choice} onChange={setChoice}>
        <ChoiceboxGroup.Item value="free" title="Free" description="Free" />
        <ChoiceboxGroup.Item
          value="trial"
          title="Pro trial"
          description="Free for two weeks"
        />
        <ChoiceboxGroup.Item
          value="pro"
          title="Pro"
          description="Get started now"
        />
        <ChoiceboxGroup.Item
          value="beta"
          title="Beta"
          description="Will be available soon"
        />
      </ChoiceboxGroup>
      <ChoiceboxGroup
        label="Multiselect group"
        value={choices}
        onChange={setChoices}
        type="checkbox"
        direction="col"
      >
        <ChoiceboxGroup.Item value="free" title="Free" description="Free" />
        <ChoiceboxGroup.Item
          value="trial"
          title="Pro trial"
          description="Free for two weeks"
        />
        <ChoiceboxGroup.Item
          value="pro"
          title="Pro"
          description="Get started now"
        />
        <ChoiceboxGroup.Item
          value="beta"
          title="Beta"
          description="Will be available soon"
        />
      </ChoiceboxGroup>
    </article>
  );
}
