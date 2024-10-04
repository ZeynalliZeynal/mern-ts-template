import Stack from "@/components/ui/stack.tsx";
import Checkbox from "@/components/ui/checkbox.tsx";
import { useState } from "react";

export default function CheckboxDemo() {
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <Stack>
      <Checkbox
        checked={checked}
        onChange={() => setChecked((prevState) => !prevState)}
      >
        Checkbox
      </Checkbox>
      <Checkbox disabled>Disabled Checkbox</Checkbox>
    </Stack>
  );
}
