import Stack from "@/components/ui/stack.tsx";
import CollapseGroup, { Collapse } from "@/components/ui/collapse.tsx";

export default function CollapseDemo() {
  return (
    <Stack>
      <CollapseGroup>
        <Collapse title="Question A" size="sm">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
          repellat repudiandae voluptates. Alias eaque esse eum ex facilis
          maxime neque non omnis praesentium, quae, quaerat quo unde? Ea fuga,
          nulla!
        </Collapse>
        <Collapse title="Question B">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
          repellat repudiandae voluptates. Alias eaque esse eum ex facilis
          maxime neque non omnis praesentium, quae, quaerat quo unde? Ea fuga,
          nulla!
        </Collapse>
      </CollapseGroup>
    </Stack>
  );
}
