import Stack from "@/components/ui/stack.tsx";
import Accordion from "@/components/ui/accordion.tsx";

export default function CollapseDemo() {
  return (
    <Stack gap={0}>
      {/*<CollapseGroup>*/}
      {/*  <Collapse title="Question A" size="sm">*/}
      {/*    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas*/}
      {/*    repellat repudiandae voluptates. Alias eaque esse eum ex facilis*/}
      {/*    maxime neque non omnis praesentium, quae, quaerat quo unde? Ea fuga,*/}
      {/*    nulla!*/}
      {/*  </Collapse>*/}
      {/*  <Collapse title="Question B">*/}
      {/*    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas*/}
      {/*    repellat repudiandae voluptates. Alias eaque esse eum ex facilis*/}
      {/*    maxime neque non omnis praesentium, quae, quaerat quo unde? Ea fuga,*/}
      {/*    nulla!*/}
      {/*  </Collapse>*/}
      {/*</CollapseGroup>*/}
      <Accordion type="single" collapsible>
        <Accordion.Item value="item 1" className="max-w-xl w-full">
          <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
          <Accordion.Content className="border-b">
            Yes. It adheres to the WAI-ARIA design pattern.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item 2" className="max-w-xl w-full">
          <Accordion.Trigger>Is it styled?</Accordion.Trigger>
          <Accordion.Content className="border-b">
            Yes. It comes with default styles that matches the other components'
            aesthetic.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item 3" className="max-w-xl w-full">
          <Accordion.Trigger>Is it animated?</Accordion.Trigger>
          <Accordion.Content className="border-b">
            Yes. It's animated by default, but you can disable it if you prefer.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
