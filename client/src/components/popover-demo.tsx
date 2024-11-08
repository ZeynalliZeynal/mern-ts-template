import Stack from "@/components/ui/stack.tsx";
import { useState } from "react";
import Popover from "@/components/ui/popover.tsx";
import { IoCheckmarkOutline } from "react-icons/io5";
import Button from "@/components/ui/button.tsx";

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
  const [value1, setValue1] = useState(values1[0].value);
  const [value2, setValue2] = useState("");

  const initialValue = values2.find((value) => value.value === value2)?.label;

  return (
    <Stack>
      <Popover>
        <Popover.Trigger prefix="Style:" className="min-w-36 text-xs">
          {values1.find((value) => value.value === value1)?.label}
        </Popover.Trigger>
        <Popover.Content>
          {values1.map((item) => (
            <Popover.Item
              className="text-xs"
              key={item.value}
              value={item.value}
              suffix={item.value === value1 ? <IoCheckmarkOutline /> : null}
              onSelect={(currentValue) => setValue1(currentValue)}
            >
              {item.label}
            </Popover.Item>
          ))}
        </Popover.Content>
      </Popover>
      <Popover valueRemovable>
        <Popover.Trigger asChild>
          <Button full size="sm">
            {initialValue || "Select a framework"}
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Label>Frameworks</Popover.Label>
          <Popover.Separator />
          <Popover.Group>
            {values2.map((item) => (
              <Popover.Item
                key={item.value}
                value={item.value}
                suffix={item.value === value2 ? <IoCheckmarkOutline /> : null}
                onSelect={(currentValue) => setValue2(currentValue)}
              >
                {item.label}
              </Popover.Item>
            ))}
            <Popover.Item
              value="disabled"
              disabled
              onSelect={(currentValue) => setValue2(currentValue)}
            >
              disabled
            </Popover.Item>
          </Popover.Group>
        </Popover.Content>
      </Popover>
    </Stack>
  );
}
