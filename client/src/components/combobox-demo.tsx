import Stack from "@/components/ui/stack.tsx";
import Combobox from "@/components/ui/combobox.tsx";
import { useState } from "react";

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

export default function ComboboxDemo() {
  const [comboboxValue, setComboboxValue] = useState("");
  return (
    <Stack>
      <Combobox value={comboboxValue} onChange={setComboboxValue}>
        <Combobox.Input />
        <Combobox.Content>
          {comboboxValues.map((v) => (
            <Combobox.Item value={v.value} key={v.value}>
              {v.label}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox>
    </Stack>
  );
}
