import Stack from "@/components/ui/stack.tsx";
import { useState } from "react";
import Select from "@/components/ui/select.tsx";
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

export default function SelectDemo() {
  const [value1, setValue1] = useState(values1[0].value);
  const [value2, setValue2] = useState("");

  const initialValue = values2.find((value) => value.value === value2)?.label;

  return (
    <Stack>
      <Select>
        <Select.Trigger prefix="Style:" className="min-w-36 text-xs">
          {values1.find((value) => value.value === value1)?.label}
        </Select.Trigger>
        <Select.Content>
          {values1.map((item) => (
            <Select.Item
              className="text-xs"
              key={item.value}
              value={item.value}
              suffix={item.value === value1 ? <IoCheckmarkOutline /> : null}
              onSelect={(currentValue) => setValue1(currentValue)}
            >
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      <Select valueRemovable>
        <Select.Trigger asChild>
          <Button full size="sm">
            {initialValue || "Select a framework"}
          </Button>
        </Select.Trigger>
        <Select.Content>
          <Select.Label>Frameworks</Select.Label>
          <Select.Separator />
          <Select.Group>
            {values2.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                suffix={item.value === value2 ? <IoCheckmarkOutline /> : null}
                onSelect={(currentValue) => setValue2(currentValue)}
              >
                {item.label}
              </Select.Item>
            ))}
            <Select.Item
              value="disabled"
              disabled
              onSelect={(currentValue) => setValue2(currentValue)}
            >
              disabled
            </Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>
    </Stack>
  );
}
