import Stack from "@/components/ui/stack.tsx";
import Select from "@/components/ui/select.tsx";
import Button from "@/components/ui/button.tsx";
import { IoCheckmarkOutline } from "react-icons/io5";
import { useState } from "react";
import Command from "@/components/ui/command.tsx";

const values = [
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

const ComboboxDemo = () => {
  const [comboboxValue, setComboboxValue] = useState("");
  const initialValue = values.find(
    (value) => value.value === comboboxValue,
  )?.label;

  return (
    <Stack>
      <Select valueRemovable>
        <Select.Trigger asChild>
          <Button full size="sm">
            {initialValue || "Select a framework"}
          </Button>
        </Select.Trigger>
        <Select.Content>
          <Command>
            <Command.Input
              placeholder="Search framework..."
              disableFocusShortcut
            />
            <Command.Group heading="Frameworks">
              {values.map((item) => (
                <Command.Item
                  key={item.value}
                  value={item.value}
                  suffix={
                    item.value === comboboxValue ? <IoCheckmarkOutline /> : null
                  }
                  onSelect={(currentValue) => setComboboxValue(currentValue)}
                >
                  {item.label}
                </Command.Item>
              ))}
              <Command.Item
                value="disabled"
                disabled
                onSelect={(currentValue) => setComboboxValue(currentValue)}
              >
                disabled
              </Command.Item>
            </Command.Group>
          </Command>
        </Select.Content>
      </Select>
    </Stack>
  );
};

export default ComboboxDemo;
