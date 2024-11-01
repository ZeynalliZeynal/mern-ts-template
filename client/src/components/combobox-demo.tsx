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

const comboboxValues2 = [
  {
    value: "1",
    label: "Zelman",
  },
  {
    value: "2",
    label: "Zaymur",
  },
  {
    value: "3",
    label: "Zimran",
  },
];

export default function ComboboxDemo() {
  const [comboboxValue, setComboboxValue] = useState("");
  const [value2, setValue2] = useState("");

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
      <Combobox value={value2} onChange={setValue2}>
        <Combobox.Input />
        <Combobox.Content>
          {comboboxValues2.map((v) => (
            <Combobox.Item value={v.value} key={v.value}>
              {v.label}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox>
    </Stack>
  );
}
