import Dialog from "@/components/ui/dialog.tsx";

export default function DialogDemo() {
  return (
    <Dialog>
      <Dialog.Trigger>Open a dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog>
  );
}
