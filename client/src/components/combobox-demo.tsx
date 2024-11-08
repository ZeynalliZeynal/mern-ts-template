import Stack from "@/components/ui/stack.tsx";
import { useState } from "react";
import Popover from "@/components/ui/popover.tsx";
import Command from "@/components/ui/command.tsx";
import { LuMail, LuSettings2, LuUser2 } from "react-icons/lu";

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
  const [value, setValue] = useState();

  return (
    <Stack>
      <Popover>
        <Popover.Trigger>Open combobox</Popover.Trigger>
        <Popover.Content className="w-56">
          <Command>
            <Command.Input placeholder="search" />
            <Command.Content>
              <Command.Item href="/profile" prefix={<LuUser2 />}>
                Profile
              </Command.Item>
              <Command.Item prefix={<LuMail />}>Mail</Command.Item>
              <Command.Item prefix={<LuSettings2 />}>Settings</Command.Item>
            </Command.Content>
          </Command>
        </Popover.Content>
      </Popover>
      {/*<Combobox value={comboboxValue} onChange={setComboboxValue}>*/}
      {/*  <Combobox.Input />*/}
      {/*  <Combobox.Content>*/}
      {/*    {comboboxValues.map((v) => (*/}
      {/*      <Combobox.Item value={v.value} key={v.value}>*/}
      {/*        {v.label}*/}
      {/*      </Combobox.Item>*/}
      {/*    ))}*/}
      {/*  </Combobox.Content>*/}
      {/*</Combobox>*/}
      {/*<Combobox value={value2} onChange={setValue2}>*/}
      {/*  <Combobox.Input />*/}
      {/*  <Combobox.Content>*/}
      {/*    {comboboxValues2.map((v) => (*/}
      {/*      <Combobox.Item value={v.value} key={v.value}>*/}
      {/*        {v.label}*/}
      {/*      </Combobox.Item>*/}
      {/*    ))}*/}
      {/*  </Combobox.Content>*/}
      {/*</Combobox>*/}
    </Stack>
  );
}
