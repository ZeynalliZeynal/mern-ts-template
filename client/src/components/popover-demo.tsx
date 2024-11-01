import Stack from "@/components/ui/stack.tsx";
import { useState } from "react";
import Popover from "@/components/ui/popover.tsx";

const values1 = [
  {
    value: "newyork",
    label: "New York",
  },
  {
    value: "default",
    label: "Default",
  },
];

const values2 = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "react.js",
    label: "React.js",
  },
  {
    value: "vue.js",
    label: "Vue.js",
  },
  {
    value: "Astro",
    label: "Astro",
  },
];

export default function PopoverDemo() {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  return (
    <Stack>
      <Popover>
        <Popover.Trigger prefix="Style:">{values1[0].label}</Popover.Trigger>
        <Popover.Content>test</Popover.Content>
      </Popover>
    </Stack>
  );
}
