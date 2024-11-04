import Dialog from "@/components/ui/dialog.tsx";
import { IoClose } from "react-icons/io5";
import Button from "@/components/ui/button.tsx";

export default function DialogDemo() {
  return (
    <Dialog>
      <Dialog.Trigger>Open a dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close className="absolute p-1 top-4 right-4 text-foreground rounded-md">
          <IoClose aria-hidden="true" size={16} />
        </Dialog.Close>
        <Dialog.Header>
          <Dialog.Title className="flex items-center justify-between">
            Edit Profile
          </Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button size="sm">Ok</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
