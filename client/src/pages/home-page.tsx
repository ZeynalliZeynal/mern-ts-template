import Button from "@/components/ui/button.tsx";
import ThemeSwitcher from "@/components/ui/theme.tsx";
import Spinner from "@/components/ui/spinner.tsx";
import Badge from "@/components/ui/badge.tsx";
import { ArrowDown, ThumbsUpIcon } from "lucide-react";
import AvatarGroup from "@/components/ui/avatar-group.tsx";
import Checkbox from "@/components/ui/checkbox.tsx";
import { useState } from "react";
import ChoiceboxGroup from "@/components/ui/choicebox.tsx";
import Stack from "@/components/ui/stack.tsx";
import CollapseGroup, { Collapse } from "@/components/ui/collapse.tsx";
import Combobox from "@/components/ui/combobox.tsx";

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

const comboboxValues = [
  {
    value: "zeynal",
    label: "Frontend",
  },
  {
    value: "samir",
    label: "Backend",
  },
  {
    value: "negrito",
    label: "Cango",
  },
];

export default function HomePage() {
  const [checked, setChecked] = useState<boolean>(false);
  const [choice, setChoice] = useState<string>("trial");
  const [choices, setChoices] = useState([] as string[]);
  const [comboboxValue, setComboboxValue] = useState("");

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
      <Stack gap={4}>
        <AvatarGroup members={avatars} size={32} limit={4} />
        <AvatarGroup members={avatars} size={32} />
      </Stack>
      <Stack>
        <CollapseGroup>
          <Collapse title="Question A" size="sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
            repellat repudiandae voluptates. Alias eaque esse eum ex facilis
            maxime neque non omnis praesentium, quae, quaerat quo unde? Ea fuga,
            nulla!
          </Collapse>
          <Collapse title="Question B">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
            repellat repudiandae voluptates. Alias eaque esse eum ex facilis
            maxime neque non omnis praesentium, quae, quaerat quo unde? Ea fuga,
            nulla!
          </Collapse>
        </CollapseGroup>
      </Stack>
      <Stack>
        <Checkbox
          checked={checked}
          onChange={() => setChecked((prevState) => !prevState)}
        >
          Checkbox
        </Checkbox>
        <Checkbox disabled>Disabled Checkbox</Checkbox>
      </Stack>
      <Stack>
        <Combobox value={comboboxValue} onChange={setComboboxValue}>
          <Combobox.Input />
          <Combobox.List>
            {comboboxValues.map((v) => (
              <Combobox.Option value={v.value} key={v.value}>
                {v.label}
              </Combobox.Option>
            ))}
          </Combobox.List>
        </Combobox>
      </Stack>
      <Stack>
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
      </Stack>
    </article>
  );
}
