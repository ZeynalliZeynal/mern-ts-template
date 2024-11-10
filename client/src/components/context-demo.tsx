import Stack from "@/components/ui/stack.tsx";
import ContextMenu from "@/components/ui/context-menu/context-menu.tsx";
import ContextMenuSub from "@/components/ui/context-menu/context-menu-sub.tsx";
import { toast } from "sonner";
import { useState } from "react";
import Spinner from "@/components/ui/spinner.tsx";
import { useAdvancedParams } from "@/hooks/useAdvancedParams.ts";

const radioValues = [
  {
    value: "pedroduarte",
    label: "Pedro Duarte",
  },
  {
    value: "zeynallizeynal",
    label: "Zeynalli Zeynal",
  },
];

export default function ContextDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSingleParam, params } = useAdvancedParams();
  const [radioValue, setRadioValue] = useState(radioValues[0].value);

  return (
    <Stack>
      <ContextMenu>
        <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
        <ContextMenu.Content className="min-w-64">
          <ContextMenu.Group>
            <ContextMenu.Item inset shortcut="⌘[">
              Back
            </ContextMenu.Item>
            <ContextMenu.Item inset disabled shortcut="⌘]">
              Forward
            </ContextMenu.Item>
            <ContextMenu.Item inset shortcut="⌘]" asChild>
              Reload
            </ContextMenu.Item>
            <ContextMenuSub>
              <ContextMenuSub.Trigger inset>More tools</ContextMenuSub.Trigger>
              <ContextMenuSub.Content className="w-48">
                <ContextMenu.Group>
                  <ContextMenu.Item
                    shortcut="⇧⌘S"
                    prefix={isLoading ? <Spinner size={16} /> : null}
                    disabled={isLoading}
                    onClick={async () => {
                      setIsLoading(true);
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      setIsLoading(false);
                      toast.info("new friend added");
                    }}
                  >
                    Save page as...
                  </ContextMenu.Item>
                  <ContextMenu.Item>Create shortcut...</ContextMenu.Item>
                  <ContextMenu.Item>Name window...</ContextMenu.Item>
                </ContextMenu.Group>
                <ContextMenu.Separator />
                <ContextMenu.Group>
                  <ContextMenu.Item>Developer tools</ContextMenu.Item>
                </ContextMenu.Group>
              </ContextMenuSub.Content>
            </ContextMenuSub>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.CheckboxItem
              inset
              checked={params("bookmarks")?.includes("show")}
              onCheck={() => handleSingleParam("bookmarks", "show")}
            >
              Show Bookmarks bar
            </ContextMenu.CheckboxItem>
            <ContextMenu.CheckboxItem
              inset
              checked={params("fullUrls")?.includes("show")}
              onCheck={() => handleSingleParam("fullUrls", "show")}
            >
              Show full URLs
            </ContextMenu.CheckboxItem>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.RadioGroup value={radioValue}>
            <ContextMenu.Label inset>People</ContextMenu.Label>
            <ContextMenu.Separator />
            {radioValues.map((value) => (
              <ContextMenu.RadioItem
                inset
                key={value.value}
                value={value.value}
                onChange={(currentValue) => setRadioValue(currentValue)}
              >
                {value.label}
              </ContextMenu.RadioItem>
            ))}
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu>
    </Stack>
  );
}
