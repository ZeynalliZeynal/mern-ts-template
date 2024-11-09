import Dialog from "@/components/ui/dialog.tsx";
import { IoCheckmarkOutline, IoClose } from "react-icons/io5";
import Button from "@/components/ui/button.tsx";
import Select from "@/components/ui/popover.tsx";
import { useState } from "react";
import { FaCookieBite } from "react-icons/fa6";
import { PiCaretUpDownBold } from "react-icons/pi";
import Spinner from "@/components/ui/spinner.tsx";
import { toast } from "sonner";

const values = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "only_necessary",
    label: "Only Necessary",
  },
];

export default function DialogDemo() {
  const [value, setValue] = useState(values[0].value);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const initialValue = values.find((val) => val.value === value);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Overlay />
        <Dialog.Trigger suffix={<FaCookieBite size={12} />}>
          Cookies
        </Dialog.Trigger>
        <Dialog.Content className="max-w-xl">
          <Dialog.Close className="absolute p-1 top-4 right-4 text-foreground rounded-md">
            <IoClose aria-hidden="true" size={16} />
          </Dialog.Close>
          <Dialog.Header>
            <Dialog.Title className="flex items-center justify-between">
              We value your privacy
            </Dialog.Title>
            <Dialog.Description>
              We use cookies to enhance your browsing experience, serve
              personalized ads or content, and analyze our traffic. By selecting
              "Accept All", you consent to our use of cookies
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer className="justify-between">
            <Select>
              <Select.Trigger asChild>
                {/*<button className="rounded-md flex items-center justify-between gap-2 text-xs h-8 px-3 min-w-20 border hover:bg-gray-alpha-200 text-gray-900 hover:text-foreground transition">*/}
                {/*  <span className="size-3">*/}
                {/*    <PiCaretUpDownBold className="opacity-60" />*/}
                {/*  </span>*/}
                {/*</button>*/}
                <Button
                  suffix={<PiCaretUpDownBold className="opacity-60 size-3" />}
                  primary
                >
                  {initialValue?.label}
                </Button>
              </Select.Trigger>
              <Select.Content
                className="min-w-40"
                align="horizontal-left-bottom"
              >
                <Select.Group>
                  {values.map((val) => (
                    <Select.Item
                      key={val.value}
                      value={val.value}
                      onSelect={(currentValue) => setValue(currentValue)}
                      suffix={
                        val.value === value ? <IoCheckmarkOutline /> : null
                      }
                    >
                      {val.label}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>{" "}
            </Select>
            <div className="flex-grow h-px bg-gray-alpha-400 mx-3" />
            <div className="flex items-center gap-2">
              <Button
                size="md"
                primary
                onClick={() => {
                  toast.info("Just for demonstration");
                  setDialogOpen(false);
                }}
              >
                Customize
              </Button>
              {/*<Dialog.Close*/}
              {/*  asChild*/}
              {/*  onClick={() => {*/}
              {/*    toast.info("Just for demonstration");*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <Button size="md" primary>*/}
              {/*    Customize*/}
              {/*  </Button>*/}
              {/*</Dialog.Close>*/}
              <Dialog.Close
                asChild
                onClick={async () => {
                  setIsPending(true);
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                  setIsPending(false);
                  toast.success(
                    "Cookies updated! (Recommended way of closing)",
                    {
                      icon: <FaCookieBite />,
                    },
                  );
                }}
              >
                <Button
                  size="md"
                  disabled={isPending}
                  suffix={isPending && <Spinner />}
                >
                  {isPending ? "Accepting" : "Accept"} {initialValue?.label}
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
