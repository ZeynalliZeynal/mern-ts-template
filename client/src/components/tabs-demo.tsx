import Stack from "@/components/ui/stack.tsx";
import Tabs from "@/components/ui/tabs.tsx";

const TabsDemo = () => {
  return (
    <Stack>
      <Tabs defaultValue="accounts" className="w-[400px]">
        <Tabs.List>
          <Tabs.Trigger value="accounts">Accounts</Tabs.Trigger>
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          value="accounts"
          className="bg-ui-background border rounded-lg p-6"
        >
          Accounts
        </Tabs.Content>
        <Tabs.Content
          value="profile"
          className="bg-ui-background border rounded-lg p-6"
        >
          Profile
        </Tabs.Content>
      </Tabs>
    </Stack>
  );
};

export default TabsDemo;
