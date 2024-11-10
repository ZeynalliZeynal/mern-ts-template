import Stack from "@/components/ui/stack.tsx";
import Select from "@/components/ui/select.tsx";
import Button from "@/components/ui/button.tsx";
import { IoCheckmarkOutline } from "react-icons/io5";
import { useState } from "react";
import Command from "@/components/ui/command.tsx";
import { LuChevronsUpDown } from "react-icons/lu";

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
          <Button
            primary
            suffix={<LuChevronsUpDown className="opacity-60" />}
            className="w-48"
          >
            {initialValue || "Select a framework"}
          </Button>
        </Select.Trigger>
        <Select.Content className="!p-0" fitToTrigger>
          <Command>
            <Command.Input
              placeholder="Search framework..."
              disableFocusShortcut
            />
            <Command.Content>
              <Command.Empty>No frameworks found</Command.Empty>
              <Command.Group className="p-1">
                <Command.Label>Frameworks</Command.Label>
                <Select.Separator />
                {values.map((item) => (
                  <Command.Item
                    key={item.value}
                    value={item.value}
                    suffix={
                      item.value === comboboxValue ? (
                        <IoCheckmarkOutline />
                      ) : null
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
            </Command.Content>
          </Command>
        </Select.Content>
      </Select>
    </Stack>
  );
};

export default ComboboxDemo;
