import Stack from "@/components/ui/stack.tsx";
import ChoiceboxGroup from "@/components/ui/choicebox.tsx";
import { useState } from "react";

export default function ChoiceboxDemo() {
  const [choice, setChoice] = useState<string>("trial");
  const [choices, setChoices] = useState([] as string[]);
  return (
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
  );
}
