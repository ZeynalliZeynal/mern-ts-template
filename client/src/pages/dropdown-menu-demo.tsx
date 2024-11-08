import DropdownMenu from "@/components/ui/dropdown-menu/dropdown-menu.tsx";
import { IoSaveOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";

const DropdownMenuDemo = () => {
  return (
    <div className="h-full px-64 justify-center grid grid-cols-2 place-items-center">
      <DropdownMenu>
        <DropdownMenu.Trigger className="w-52">
          Horizontal center bottom
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-32" align="horizontal-center-bottom">
          <DropdownMenu.Item inset prefix={<IoSaveOutline />}>
            Save
          </DropdownMenu.Item>
          <DropdownMenu.Item inset prefix={<FaRegEdit />}>
            Edit
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className="w-52">
          Horizontal center top
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-32" align="horizontal-center-top">
          <DropdownMenu.Item inset prefix={<IoSaveOutline />}>
            Save
          </DropdownMenu.Item>
          <DropdownMenu.Item inset prefix={<FaRegEdit />}>
            Edit
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className="w-52">
          Horizontal left bottom
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-32" align="horizontal-left-bottom">
          <DropdownMenu.Item inset prefix={<IoSaveOutline />}>
            Save
          </DropdownMenu.Item>
          <DropdownMenu.Item inset prefix={<FaRegEdit />}>
            Edit
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className="w-52">
          Horizontal left top
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-32" align="horizontal-left-top">
          <DropdownMenu.Item inset prefix={<IoSaveOutline />}>
            Save
          </DropdownMenu.Item>
          <DropdownMenu.Item inset prefix={<FaRegEdit />}>
            Edit
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className="w-52">
          Horizontal right bottom
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-32" align="horizontal-right-bottom">
          <DropdownMenu.Item inset prefix={<IoSaveOutline />}>
            Save
          </DropdownMenu.Item>
          <DropdownMenu.Item inset prefix={<FaRegEdit />}>
            Edit
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className="w-52">
          Horizontal right top
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-32" align="horizontal-right-top">
          <DropdownMenu.Item inset prefix={<IoSaveOutline />}>
            Save
          </DropdownMenu.Item>
          <DropdownMenu.Item inset prefix={<FaRegEdit />}>
            Edit
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className="w-52">
          Vertical right bottom
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-32" align="vertical-right-bottom">
          <DropdownMenu.Item inset prefix={<IoSaveOutline />}>
            Save
          </DropdownMenu.Item>
          <DropdownMenu.Item inset prefix={<FaRegEdit />}>
            Edit
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className="w-52">
          Vertical right top
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-32" align="vertical-right-top">
          <DropdownMenu.Item inset prefix={<IoSaveOutline />}>
            Save
          </DropdownMenu.Item>
          <DropdownMenu.Item inset prefix={<FaRegEdit />}>
            Edit
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className="w-52">
          Vertical left bottom
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-32" align="vertical-left-bottom">
          <DropdownMenu.Item inset prefix={<IoSaveOutline />}>
            Save
          </DropdownMenu.Item>
          <DropdownMenu.Item inset prefix={<FaRegEdit />}>
            Edit
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className="w-52">
          Vertical left top
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-32" align="vertical-left-top">
          <DropdownMenu.Item inset prefix={<IoSaveOutline />}>
            Save
          </DropdownMenu.Item>
          <DropdownMenu.Item inset prefix={<FaRegEdit />}>
            Edit
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

export default DropdownMenuDemo;
